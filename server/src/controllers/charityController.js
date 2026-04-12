const Charity  = require("../models/Charity");
const Donation = require("../models/Donation");

// GET /charities — public list with search, category filter, and pagination
const getCharities = async (req, res) => {
  try {
    const { category, page = 1, limit = 12, search = "" } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const charities = await Charity.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Charity.countDocuments(filter);

    // Compute live donor count
    const ids = charities.map(c => c._id);
    const donorStats = await Donation.aggregate([
      { $match: { charity: { $in: ids }, status: "succeeded" } },
      { $group: { _id: "$charity", donorCount: { $addToSet: "$user" }, totalRaised: { $sum: "$amount" } } },
    ]);
    const statsMap = {};
    donorStats.forEach(d => { statsMap[d._id.toString()] = { donorCount: d.donorCount.length }; });

    const enriched = charities.map(c => {
      const obj = c.toObject();
      obj.donorCount = statsMap[c._id.toString()]?.donorCount || 0;
      return obj;
    });

    res.json({ charities: enriched, currentPage: Number(page), totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch funds" });
  }
};

// GET /charities/:id — single fund with live donor count 
const getCharity = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id).populate("category", "name");
    if (!charity) return res.status(404).json({ message: "Fund not found" });

    // Aggregate to get unique donor count and total donations for this fund
    const [donorStat] = await Donation.aggregate([
      { $match: { charity: charity._id, status: "succeeded" } },
      { $group: { _id: "$charity", donorCount: { $addToSet: "$user" }, totalDonations: { $sum: 1 } } },
    ]);

    const obj = charity.toObject();
    obj.donorCount = donorStat?.donorCount?.length || 0;
    obj.totalDonations = donorStat?.totalDonations || 0;

    res.json({ charity: obj });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch fund" });
  }
};

// GET /charities/admin/all — admin only
const getAllCharitiesAdmin = async (req, res) => {
  try {
    const Charity = require("../models/Charity");

    const charities = await Charity.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ charities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch funds" });
  }
};

// POST /charities — admin only
const createCharity = async (req, res) => {
  try {
    const data = { ...req.body };

    // Parse goals from JSON string 
    if (typeof data.goals === "string") {
      try { data.goals = JSON.parse(data.goals); } catch {}
    }

    // Attach the uploaded cover image filename if one was provided
    if (req.file) data.coverImage = req.file.path;

    const charity = new Charity(data);
    await charity.save();
    res.status(201).json({ message: "Fund created successfully", charity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to create fund" });
  }
};

//PATCH /charities/:id — admin only
const updateCharity = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (typeof updates.goals === "string") {
      try { updates.goals = JSON.parse(updates.goals); } catch {}
    }
    if (req.file) updates.coverImage = req.file.path;

    const charity = await Charity.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!charity) return res.status(404).json({ message: "Fund not found" });
    res.json({ message: "Fund updated", charity });
  } catch (err) {
    res.status(500).json({ message: "Failed to update fund" });
  }
};

// DELETE /charities/:id — admin only
const deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);
    if (!charity) return res.status(404).json({ message: "Fund not found" });
    res.json({ message: "Fund deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete fund" });
  }
};

// POST /charities/:id/update — admin only
const addProjectUpdate = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) return res.status(404).json({ message: "Fund not found" });

    // Collect paths of any uploaded images 
    const imagePaths = req.files ? req.files.map(f => f.path) : [];

    charity.transparencyUpdates.push({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "started",
      images: imagePaths,
    });

    await charity.save();
    res.json({ message: "Update added successfully", charity });
  } catch (err) {
    res.status(500).json({ message: "Failed to add update" });
  }
};

module.exports = { getCharities, getCharity, createCharity, updateCharity, deleteCharity, addProjectUpdate, getAllCharitiesAdmin };