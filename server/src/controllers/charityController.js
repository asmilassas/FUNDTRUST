const Charity = require('../models/Charity');
const Category = require('../models/Category');


const getCharities = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    const charities = await Charity.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.json({ charities });
  } catch (error) {
    console.error("Get charities error", error);
    return res.status(500).json({ message: "Unable to fetch charities" });
  }
};


const getCharity = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id)
  .populate('category', 'name description');

    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }

    return res.json({ charity });
  } catch (error) {
    console.error('Get charity error', error);
    return res.status(500).json({ message: 'Unable to fetch charity' });
  }
};

const ensureAdmin = (user) => {
  if (!user?.isAdmin) {
    const error = new Error('Admin privileges required');
    error.status = 403;
    throw error;
  }
};

const createCharity = async (req, res) => {
  try {
    ensureAdmin(req.user);

    const { category } = req.body;

    // Validate category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const charity = await Charity.create(req.body);

    const populatedCharity = await charity.populate('category', 'name description');

    return res.status(201).json({ charity: populatedCharity });

  } catch (error) {
    console.error('Create charity error', error);
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Unable to create charity' });
  }
};


const updateCharity = async (req, res) => {
  try {
    ensureAdmin(req.user);
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }

    return res.json({ charity });
  } catch (error) {
    console.error('Update charity error', error);
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Unable to update charity' });
  }
};

const deleteCharity = async (req, res) => {
  try {
    ensureAdmin(req.user);
    const charity = await Charity.findByIdAndDelete(req.params.id);

    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }

    return res.json({ message: 'Charity removed' });
  } catch (error) {
    console.error('Delete charity error', error);
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Unable to delete charity' });
  }
};



module.exports = {
  getCharities,
  getCharity,
  createCharity,
  updateCharity,
  deleteCharity,
};
