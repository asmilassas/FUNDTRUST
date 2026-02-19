const Category = require("../models/Category");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const category = new Category({
      name,
      description,
      image,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, image },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ success: true, category });
  } catch (error) {
    console.error("Update category error", error);
    res.status(500).json({ message: "Unable to update category" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error", error);
    res.status(500).json({ message: "Unable to delete category" });
  }
};


