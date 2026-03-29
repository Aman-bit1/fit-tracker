const asyncHandler = require('express-async-handler');

const searchFood = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    res.status(400);
    throw new Error('Please provide a search query');
  }

  const appId = process.env.EDAMAM_APP_ID;
  const appKey = process.env.EDAMAM_APP_KEY;

  if (!appId || appId === 'your_app_id' || !appKey || appKey === 'your_app_key') {
    const mockData = getMockFoodData(query);
    return res.status(200).json({
      success: true,
      data: mockData,
      source: 'mock'
    });
  }

  try {
    const response = await fetch(
      `https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(query)}&app_id=${appId}&app_key=${appKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from API');
    }

    const data = await response.json();

    const results = data.hints?.slice(0, 10).map(hint => ({
      name: hint.food.label,
      calories: Math.round(hint.food.nutrients.ENERC_KCAL || 0),
      protein: Math.round(hint.food.nutrients.PROCNT || 0),
      carbs: Math.round(hint.food.nutrients.CHOCDF || 0),
      fats: Math.round(hint.food.nutrients.FAT || 0),
      servingSize: hint.food.measures?.[0]?.label || '100g'
    })) || [];

    res.status(200).json({
      success: true,
      data: results,
      source: 'api'
    });
  } catch (error) {
    const mockData = getMockFoodData(query);
    res.status(200).json({
      success: true,
      data: mockData,
      source: 'mock'
    });
  }
});

const getMockFoodData = (query) => {
  const mockFoods = [
    // ==================== EGG DISHES ====================
    { name: 'Omelette (Plain, 2 Eggs)', calories: 180, protein: 13, carbs: 1, fats: 14, servingSize: '1 omelette' },
    { name: 'Omelette (3 Eggs)', calories: 270, protein: 19, carbs: 2, fats: 21, servingSize: '1 omelette' },
    { name: 'Egg Omelette with Vegetables', calories: 200, protein: 14, carbs: 5, fats: 14, servingSize: '1 omelette' },
    { name: 'Masala Omelette', calories: 210, protein: 14, carbs: 4, fats: 15, servingSize: '1 omelette' },
    { name: 'Cheese Omelette', calories: 280, protein: 18, carbs: 2, fats: 22, servingSize: '1 omelette' },
    { name: 'Boiled Egg', calories: 78, protein: 6.3, carbs: 0.6, fats: 5.3, servingSize: '1 egg (50g)' },
    { name: 'Boiled Eggs (2)', calories: 156, protein: 12.6, carbs: 1.2, fats: 10.6, servingSize: '2 eggs (100g)' },
    { name: 'Boiled Eggs (3)', calories: 234, protein: 18.9, carbs: 1.8, fats: 15.9, servingSize: '3 eggs (150g)' },
    { name: 'Fried Egg (Sunny Side Up)', calories: 90, protein: 6, carbs: 0.4, fats: 7, servingSize: '1 egg' },
    { name: 'Poached Egg', calories: 72, protein: 6, carbs: 0.4, fats: 5, servingSize: '1 egg' },
    { name: 'Scrambled Eggs', calories: 149, protein: 10, carbs: 1, fats: 11, servingSize: '100g' },
    { name: 'Egg Bhurji', calories: 165, protein: 12, carbs: 3, fats: 12, servingSize: '100g' },
    { name: 'Egg Curry', calories: 155, protein: 10, carbs: 5, fats: 10, servingSize: '100g' },
    { name: 'Egg Sandwich', calories: 280, protein: 14, carbs: 28, fats: 12, servingSize: '1 sandwich' },
    { name: 'Egg Toast', calories: 195, protein: 10, carbs: 18, fats: 9, servingSize: '1 slice' },
    
    // ==================== RICE (EVERYDAY) ====================
    { name: 'Plain White Rice (Boiled)', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, servingSize: '100g cooked' },
    { name: 'Boiled Rice (1 Katori)', calories: 156, protein: 3.2, carbs: 34, fats: 0.4, servingSize: '1 katori (120g)' },
    { name: 'Boiled Rice (2 Katori)', calories: 312, protein: 6.4, carbs: 68, fats: 0.8, servingSize: '2 katori (240g)' },
    { name: 'White Rice (1 Cup Cooked)', calories: 205, protein: 4.3, carbs: 45, fats: 0.4, servingSize: '1 cup (186g)' },
    { name: 'Steamed Rice', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, servingSize: '100g' },
    { name: 'Rice (Raw/Dry)', calories: 365, protein: 7, carbs: 80, fats: 0.7, servingSize: '100g' },
    { name: 'Brown Rice (Cooked)', calories: 111, protein: 2.6, carbs: 23, fats: 0.9, servingSize: '100g' },
    { name: 'Jeera Rice (1 Katori)', calories: 186, protein: 3.5, carbs: 36, fats: 3, servingSize: '1 katori' },
    { name: 'Plain Pulao', calories: 160, protein: 3.5, carbs: 30, fats: 3.5, servingSize: '100g' },
    { name: 'Rice with Dal', calories: 175, protein: 6, carbs: 32, fats: 2, servingSize: '1 plate' },
    { name: 'Rice with Sambar', calories: 155, protein: 5, carbs: 28, fats: 2, servingSize: '1 plate' },
    { name: 'Curd Rice', calories: 110, protein: 4, carbs: 18, fats: 2.5, servingSize: '100g' },
    { name: 'Lemon Rice', calories: 162, protein: 3.5, carbs: 30, fats: 3, servingSize: '100g' },
    
    // ==================== DAL (EVERYDAY PLAIN) ====================
    { name: 'Plain Dal (Moong)', calories: 105, protein: 7, carbs: 19, fats: 0.4, servingSize: '100g' },
    { name: 'Plain Dal (1 Katori)', calories: 126, protein: 8, carbs: 22, fats: 0.5, servingSize: '1 katori (120g)' },
    { name: 'Dal (Toor/Arhar)', calories: 120, protein: 8, carbs: 20, fats: 0.5, servingSize: '100g' },
    { name: 'Plain Toor Dal', calories: 115, protein: 7.5, carbs: 19, fats: 0.4, servingSize: '100g' },
    { name: 'Plain Moong Dal', calories: 105, protein: 7, carbs: 18, fats: 0.3, servingSize: '100g' },
    { name: 'Plain Masoor Dal', calories: 116, protein: 9, carbs: 20, fats: 0.4, servingSize: '100g' },
    { name: 'Dal (Yellow)', calories: 110, protein: 7, carbs: 19, fats: 0.5, servingSize: '100g' },
    { name: 'Dal Tadka', calories: 126, protein: 6.5, carbs: 15, fats: 4.5, servingSize: '100g' },
    { name: 'Dal Fry', calories: 145, protein: 7, carbs: 18, fats: 6, servingSize: '100g' },
    { name: 'Dal Makhani', calories: 295, protein: 11, carbs: 28, fats: 15, servingSize: '100g' },
    { name: 'Dal Palak', calories: 110, protein: 6, carbs: 14, fats: 3, servingSize: '100g' },
    { name: 'Dal Khichdi', calories: 145, protein: 5, carbs: 26, fats: 2.5, servingSize: '100g' },
    { name: 'Sambar', calories: 80, protein: 3, carbs: 10, fats: 3, servingSize: '100g' },
    { name: 'Rasam', calories: 45, protein: 1.5, carbs: 6, fats: 1.5, servingSize: '100g' },
    
    // ==================== ROTI / CHAPATI (EVERYDAY) ====================
    { name: 'Roti', calories: 104, protein: 3.1, carbs: 20, fats: 0.6, servingSize: '1 piece (40g)' },
    { name: 'Chapati', calories: 104, protein: 3.1, carbs: 20, fats: 0.6, servingSize: '1 piece (40g)' },
    { name: 'Roti (1 piece)', calories: 104, protein: 3.1, carbs: 20, fats: 0.6, servingSize: '1 piece' },
    { name: 'Roti (2 pieces)', calories: 208, protein: 6.2, carbs: 40, fats: 1.2, servingSize: '2 pieces' },
    { name: 'Roti (3 pieces)', calories: 312, protein: 9.3, carbs: 60, fats: 1.8, servingSize: '3 pieces' },
    { name: 'Paratha', calories: 250, protein: 5, carbs: 35, fats: 10, servingSize: '1 piece (70g)' },
    { name: 'Aloo Paratha', calories: 290, protein: 6, carbs: 40, fats: 12, servingSize: '1 piece (100g)' },
    { name: 'Butter Roti', calories: 150, protein: 3, carbs: 20, fats: 6, servingSize: '1 piece' },
    { name: 'Naan', calories: 262, protein: 8.5, carbs: 45, fats: 5, servingSize: '1 piece (90g)' },
    { name: 'Butter Naan', calories: 320, protein: 8, carbs: 45, fats: 12, servingSize: '1 piece (100g)' },
    { name: 'Puri', calories: 165, protein: 2.5, carbs: 24, fats: 6, servingSize: '1 piece (45g)' },
    { name: 'Kulcha', calories: 240, protein: 6, carbs: 42, fats: 5, servingSize: '1 piece' },
    
    // ==================== BREAKFAST ITEMS ====================
    { name: 'Poha', calories: 135, protein: 3, carbs: 26, fats: 2.5, servingSize: '100g' },
    { name: 'Upma', calories: 148, protein: 4, carbs: 24, fats: 5, servingSize: '100g' },
    { name: 'Idli (1 piece)', calories: 58, protein: 2.4, carbs: 12, fats: 0.3, servingSize: '1 piece (35g)' },
    { name: 'Idli (2 pieces)', calories: 116, protein: 4.8, carbs: 24, fats: 0.6, servingSize: '2 pieces' },
    { name: 'Idli (3 pieces)', calories: 174, protein: 7.2, carbs: 36, fats: 0.9, servingSize: '3 pieces' },
    { name: 'Dosa (Plain)', calories: 133, protein: 3, carbs: 22, fats: 3.5, servingSize: '1 piece (80g)' },
    { name: 'Masala Dosa', calories: 165, protein: 4, carbs: 26, fats: 5, servingSize: '1 piece (100g)' },
    { name: 'Medu Vada', calories: 185, protein: 6, carbs: 20, fats: 9, servingSize: '1 piece (40g)' },
    { name: 'Uttapam', calories: 125, protein: 4, carbs: 20, fats: 3, servingSize: '1 piece (80g)' },
    { name: 'Bread Toast (Plain)', calories: 100, protein: 3.5, carbs: 18, fats: 1.5, servingSize: '1 slice (30g)' },
    { name: 'Bread Toast with Butter', calories: 145, protein: 4, carbs: 18, fats: 7, servingSize: '1 slice' },
    { name: 'Bread Jam', calories: 175, protein: 3.5, carbs: 32, fats: 2, servingSize: '1 slice' },
    { name: 'Cornflakes with Milk', calories: 150, protein: 4, carbs: 28, fats: 2, servingSize: '1 bowl (200ml)' },
    { name: 'Oats with Milk', calories: 180, protein: 7, carbs: 30, fats: 4, servingSize: '1 bowl' },
    { name: 'Paratha (Plain)', calories: 250, protein: 5, carbs: 35, fats: 10, servingSize: '1 piece (80g)' },
    
    // ==================== DAL & LENTILS ====================
    { name: 'Toor Dal (Arhar Dal)', calories: 199, protein: 12.4, carbs: 36.8, fats: 1.4, servingSize: '100g cooked' },
    { name: 'Moong Dal (Green Gram)', calories: 105, protein: 7, carbs: 19, fats: 0.4, servingSize: '100g cooked' },
    { name: 'Masoor Dal (Red Lentil)', calories: 116, protein: 9, carbs: 20, fats: 0.4, servingSize: '100g cooked' },
    { name: 'Chana Dal (Bengal Gram)', calories: 164, protein: 9, carbs: 27, fats: 0.6, servingSize: '100g cooked' },
    { name: 'Urad Dal (Black Gram)', calories: 104, protein: 8, carbs: 18, fats: 0.4, servingSize: '100g cooked' },
    
    // ==================== RICE DISHES ====================
    { name: 'Basmati Rice (Cooked)', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, servingSize: '100g' },
    { name: 'Jeera Rice', calories: 155, protein: 3, carbs: 30, fats: 2.5, servingSize: '100g' },
    { name: 'Pulao (Vegetable)', calories: 160, protein: 3.5, carbs: 28, fats: 4, servingSize: '100g' },
    { name: 'Chicken Biryani', calories: 178, protein: 10, carbs: 22, fats: 6, servingSize: '100g' },
    { name: 'Mutton Biryani', calories: 205, protein: 12, carbs: 22, fats: 8, servingSize: '100g' },
    { name: 'Egg Biryani', calories: 165, protein: 8, carbs: 22, fats: 5, servingSize: '100g' },
    { name: 'Vegetable Biryani', calories: 148, protein: 4, carbs: 24, fats: 4, servingSize: '100g' },
    { name: 'Hyderabadi Biryani', calories: 195, protein: 11, carbs: 24, fats: 7, servingSize: '100g' },
    { name: 'Lemon Rice', calories: 162, protein: 3.5, carbs: 30, fats: 3, servingSize: '100g' },
    { name: 'Tamarind Rice', calories: 175, protein: 3.5, carbs: 32, fats: 4, servingSize: '100g' },
    { name: 'Curd Rice', calories: 110, protein: 3.5, carbs: 18, fats: 2.5, servingSize: '100g' },
    { name: 'Fried Rice (Veg)', calories: 170, protein: 3, carbs: 28, fats: 5, servingSize: '100g' },
    { name: 'Fried Rice (Chicken)', calories: 195, protein: 8, carbs: 28, fats: 6, servingSize: '100g' },
    
    // ==================== INDIAN BREADS ====================
    { name: 'Roti / Chapati', calories: 104, protein: 3.1, carbs: 20, fats: 0.6, servingSize: '1 piece (40g)' },
    { name: 'Whole Wheat Roti', calories: 110, protein: 3.5, carbs: 22, fats: 0.7, servingSize: '1 piece (40g)' },
    { name: 'Naan (Plain)', calories: 262, protein: 8.5, carbs: 45, fats: 5, servingSize: '1 piece (90g)' },
    { name: 'Butter Naan', calories: 320, protein: 8, carbs: 45, fats: 12, servingSize: '1 piece (100g)' },
    { name: 'Garlic Naan', calories: 290, protein: 8, carbs: 45, fats: 8, servingSize: '1 piece (100g)' },
    { name: 'Paratha (Plain)', calories: 290, protein: 6, carbs: 38, fats: 12, servingSize: '1 piece (80g)' },
    { name: 'Aloo Paratha', calories: 320, protein: 7, carbs: 42, fats: 14, servingSize: '1 piece (100g)' },
    { name: 'Gobi Paratha', calories: 295, protein: 7, carbs: 40, fats: 12, servingSize: '1 piece (100g)' },
    { name: 'Puri', calories: 333, protein: 5, carbs: 48, fats: 13, servingSize: '1 piece (45g)' },
    { name: 'Bhatura', calories: 301, protein: 6, carbs: 45, fats: 10, servingSize: '1 piece (80g)' },
    { name: 'Papadum', calories: 120, protein: 6, carbs: 18, fats: 2, servingSize: '1 piece (10g)' },
    { name: 'Bhakri (Millet)', calories: 95, protein: 2.5, carbs: 18, fats: 1, servingSize: '1 piece (40g)' },
    { name: 'Rava Dosa', calories: 135, protein: 3, carbs: 22, fats: 4, servingSize: '1 piece (60g)' },
    
    // ==================== CURRIES - VEGETARIAN ====================
    { name: 'Palak Paneer', calories: 210, protein: 12, carbs: 8, fats: 15, servingSize: '100g' },
    { name: 'Paneer Butter Masala', calories: 265, protein: 10, carbs: 10, fats: 20, servingSize: '100g' },
    { name: 'Paneer Tikka Masala', calories: 230, protein: 14, carbs: 8, fats: 16, servingSize: '100g' },
    { name: 'Kadhai Paneer', calories: 220, protein: 11, carbs: 10, fats: 15, servingSize: '100g' },
    { name: 'Shahi Paneer', calories: 255, protein: 10, carbs: 12, fats: 18, servingSize: '100g' },
    { name: 'Matar Paneer', calories: 195, protein: 10, carbs: 12, fats: 12, servingSize: '100g' },
    { name: 'Aloo Gobi', calories: 115, protein: 3, carbs: 15, fats: 5, servingSize: '100g' },
    { name: 'Aloo Matar', calories: 105, protein: 2.5, carbs: 14, fats: 4.5, servingSize: '100g' },
    { name: 'Aloo Tamatar', calories: 98, protein: 2, carbs: 14, fats: 4, servingSize: '100g' },
    { name: 'Baingan Bharta', calories: 88, protein: 2, carbs: 10, fats: 4, servingSize: '100g' },
    { name: 'Bhindi Masala', calories: 115, protein: 2.5, carbs: 8, fats: 8, servingSize: '100g' },
    { name: 'Chole Masala', calories: 168, protein: 8, carbs: 22, fats: 5, servingSize: '100g' },
    { name: 'Chana Masala', calories: 155, protein: 7, carbs: 20, fats: 5, servingSize: '100g' },
    { name: 'Rajma Masala', calories: 145, protein: 8, carbs: 20, fats: 3.5, servingSize: '100g' },
    { name: 'Mixed Vegetable Curry', calories: 95, protein: 2.5, carbs: 12, fats: 4, servingSize: '100g' },
    { name: 'Malai Kofta', calories: 280, protein: 8, carbs: 20, fats: 18, servingSize: '100g' },
    { name: 'Dum Aloo', calories: 145, protein: 3, carbs: 18, fats: 7, servingSize: '100g' },
    { name: 'Paneer Korma', calories: 240, protein: 10, carbs: 10, fats: 18, servingSize: '100g' },
    { name: 'Veg Korma', calories: 165, protein: 4, carbs: 12, fats: 12, servingSize: '100g' },
    { name: 'Mushroom Masala', calories: 125, protein: 4, carbs: 10, fats: 8, servingSize: '100g' },
    { name: 'Paneer Makhani', calories: 275, protein: 10, carbs: 12, fats: 20, servingSize: '100g' },
    { name: 'Dal Palak', calories: 110, protein: 6, carbs: 14, fats: 3, servingSize: '100g' },
    { name: 'Jeera Aloo', calories: 130, protein: 2.5, carbs: 18, fats: 6, servingSize: '100g' },
    
    // ==================== CURRIES - NON-VEGETARIAN ====================
    { name: 'Butter Chicken', calories: 245, protein: 18, carbs: 8, fats: 16, servingSize: '100g' },
    { name: 'Chicken Tikka Masala', calories: 225, protein: 20, carbs: 8, fats: 12, servingSize: '100g' },
    { name: 'Chicken Curry', calories: 185, protein: 16, carbs: 6, fats: 11, servingSize: '100g' },
    { name: 'Chicken Korma', calories: 220, protein: 15, carbs: 8, fats: 15, servingSize: '100g' },
    { name: 'Chicken Vindaloo', calories: 195, protein: 16, carbs: 10, fats: 10, servingSize: '100g' },
    { name: 'Chicken Madras', calories: 175, protein: 15, carbs: 8, fats: 10, servingSize: '100g' },
    { name: 'Chicken Chettinad', calories: 180, protein: 16, carbs: 6, fats: 11, servingSize: '100g' },
    { name: 'Tandoori Chicken', calories: 165, protein: 25, carbs: 3, fats: 6, servingSize: '100g' },
    { name: 'Chicken Tikka', calories: 155, protein: 22, carbs: 4, fats: 6, servingSize: '100g' },
    { name: 'Mutton Curry', calories: 235, protein: 18, carbs: 5, fats: 16, servingSize: '100g' },
    { name: 'Mutton Rogan Josh', calories: 250, protein: 17, carbs: 6, fats: 18, servingSize: '100g' },
    { name: 'Mutton Korma', calories: 270, protein: 16, carbs: 8, fats: 20, servingSize: '100g' },
    { name: 'Mutton Biryani', calories: 220, protein: 14, carbs: 22, fats: 9, servingSize: '100g' },
    { name: 'Lamb Seekh Kebab', calories: 245, protein: 18, carbs: 6, fats: 17, servingSize: '100g' },
    { name: 'Fish Curry (Bengali)', calories: 145, protein: 16, carbs: 6, fats: 6, servingSize: '100g' },
    { name: 'Fish Fry', calories: 220, protein: 18, carbs: 8, fats: 13, servingSize: '100g' },
    { name: 'Prawn Masala', calories: 165, protein: 14, carbs: 8, fats: 8, servingSize: '100g' },
    { name: 'Egg Curry', calories: 155, protein: 10, carbs: 6, fats: 10, servingSize: '100g' },
    { name: 'Egg Bhurji', calories: 175, protein: 13, carbs: 4, fats: 12, servingSize: '100g' },
    { name: 'Keema Matar', calories: 210, protein: 16, carbs: 8, fats: 13, servingSize: '100g' },
    { name: 'Chicken Keema', calories: 195, protein: 18, carbs: 5, fats: 12, servingSize: '100g' },
    
    // ==================== SOUTH INDIAN ====================
    { name: 'Plain Dosa', calories: 133, protein: 3, carbs: 22, fats: 3.5, servingSize: '1 piece (80g)' },
    { name: 'Masala Dosa', calories: 165, protein: 4, carbs: 26, fats: 5, servingSize: '1 piece (100g)' },
    { name: 'Rava Dosa', calories: 140, protein: 3.5, carbs: 22, fats: 4, servingSize: '1 piece (80g)' },
    { name: 'Mysore Masala Dosa', calories: 175, protein: 4, carbs: 28, fats: 5.5, servingSize: '1 piece (100g)' },
    { name: 'Idli', calories: 58, protein: 2.4, carbs: 12, fats: 0.3, servingSize: '1 piece (35g)' },
    { name: 'Idli (2 pieces)', calories: 116, protein: 4.8, carbs: 24, fats: 0.6, servingSize: '2 pieces (70g)' },
    { name: 'Sambar Idli', calories: 95, protein: 4, carbs: 18, fats: 1, servingSize: '100g' },
    { name: 'Medu Vada', calories: 185, protein: 6, carbs: 20, fats: 9, servingSize: '1 piece (40g)' },
    { name: 'Masala Vada', calories: 175, protein: 5, carbs: 18, fats: 9, servingSize: '1 piece (40g)' },
    { name: 'Uttapam', calories: 125, protein: 4, carbs: 20, fats: 3, servingSize: '1 piece (80g)' },
    { name: 'Appam', calories: 110, protein: 2, carbs: 22, fats: 1.5, servingSize: '1 piece (60g)' },
    { name: 'Pongal', calories: 160, protein: 5, carbs: 24, fats: 5, servingSize: '100g' },
    { name: 'Upma', calories: 148, protein: 4, carbs: 24, fats: 5, servingSize: '100g' },
    { name: 'Poha', calories: 135, protein: 3, carbs: 26, fats: 2.5, servingSize: '100g' },
    { name: 'Lemon Poha', calories: 140, protein: 3, carbs: 27, fats: 3, servingSize: '100g' },
    { name: 'Sabudana Khichdi', calories: 182, protein: 2, carbs: 40, fats: 0.5, servingSize: '100g' },
    { name: 'Sabudana Vada', calories: 280, protein: 4, carbs: 35, fats: 14, servingSize: '2 pieces (80g)' },
    { name: 'Bisi Bele Bath', calories: 175, protein: 6, carbs: 28, fats: 5, servingSize: '100g' },
    { name: 'Curd Rice', calories: 110, protein: 4, carbs: 18, fats: 2.5, servingSize: '100g' },
    
    // ==================== SNACKS & STREET FOOD ====================
    { name: 'Samosa (1 piece)', calories: 125, protein: 2.5, carbs: 14, fats: 7, servingSize: '1 piece (50g)' },
    { name: 'Samosa (2 pieces)', calories: 250, protein: 5, carbs: 28, fats: 14, servingSize: '2 pieces (100g)' },
    { name: 'Pakora (Mixed Veg)', calories: 250, protein: 4, carbs: 24, fats: 15, servingSize: '100g' },
    { name: 'Onion Bhaji', calories: 230, protein: 4, carbs: 22, fats: 14, servingSize: '100g' },
    { name: 'Paneer Tikka (4 pieces)', calories: 180, protein: 14, carbs: 5, fats: 12, servingSize: '100g' },
    { name: 'Tandoori Paneer', calories: 195, protein: 14, carbs: 6, fats: 13, servingSize: '100g' },
    { name: 'Aloo Tikki', calories: 175, protein: 3, carbs: 22, fats: 8, servingSize: '1 piece (80g)' },
    { name: 'Pav Bhaji', calories: 170, protein: 4.5, carbs: 24, fats: 7, servingSize: '1 plate (200g)' },
    { name: 'Vada Pav', calories: 290, protein: 6, carbs: 42, fats: 11, servingSize: '1 piece (120g)' },
    { name: 'Dahi Vada', calories: 145, protein: 5, carbs: 18, fats: 6, servingSize: '1 piece (80g)' },
    { name: 'Pani Puri / Golgappa (6 pcs)', calories: 150, protein: 3, carbs: 28, fats: 3, servingSize: '6 pieces' },
    { name: 'Bhelpuri', calories: 160, protein: 3, carbs: 28, fats: 5, servingSize: '1 plate (100g)' },
    { name: 'Sev Puri', calories: 185, protein: 4, carbs: 26, fats: 8, servingSize: '1 plate (100g)' },
    { name: 'Dahi Puri (6 pcs)', calories: 175, protein: 5, carbs: 24, fats: 7, servingSize: '6 pieces' },
    { name: 'Papdi Chaat', calories: 190, protein: 4, carbs: 28, fats: 7, servingSize: '1 plate (100g)' },
    { name: 'Aloo Chaat', calories: 165, protein: 3, carbs: 24, fats: 7, servingSize: '100g' },
    { name: 'Dahi Bhalla', calories: 165, protein: 5, carbs: 22, fats: 7, servingSize: '1 plate (100g)' },
    { name: 'Chole Bhature', calories: 450, protein: 12, carbs: 62, fats: 18, servingSize: '1 plate' },
    { name: 'Pav (Bread Roll)', calories: 150, protein: 5, carbs: 28, fats: 2, servingSize: '1 piece (50g)' },
    { name: 'Kachori (1 piece)', calories: 160, protein: 4, carbs: 18, fats: 8, servingSize: '1 piece (50g)' },
    { name: 'Mathri', calories: 290, protein: 5, carbs: 38, fats: 14, servingSize: '100g' },
    { name: 'Namak Pare', calories: 350, protein: 6, carbs: 50, fats: 15, servingSize: '100g' },
    { name: 'Namkeen Mix', calories: 450, protein: 12, carbs: 45, fats: 25, servingSize: '100g' },
    { name: 'Bhelpuri (Dry)', calories: 420, protein: 10, carbs: 55, fats: 18, servingSize: '100g' },
    { name: 'Samosa Chaat', calories: 230, protein: 6, carbs: 28, fats: 11, servingSize: '1 plate (150g)' },
    
    // ==================== TIKKA & KEBABS ====================
    { name: 'Chicken Seekh Kebab', calories: 185, protein: 22, carbs: 4, fats: 10, servingSize: '100g' },
    { name: 'Chicken Malai Tikka', calories: 200, protein: 24, carbs: 4, fats: 11, servingSize: '100g' },
    { name: 'Mutton Seekh Kebab', calories: 265, protein: 18, carbs: 6, fats: 19, servingSize: '100g' },
    { name: 'Galouti Kebab', calories: 285, protein: 16, carbs: 8, fats: 22, servingSize: '100g' },
    { name: 'Shami Kebab', calories: 210, protein: 15, carbs: 12, fats: 12, servingSize: '100g' },
    { name: 'Chicken reshmi Kebab', calories: 195, protein: 23, carbs: 3, fats: 11, servingSize: '100g' },
    
    // ==================== SWEETS & DESSERTS ====================
    { name: 'Gulab Jamun (1 piece)', calories: 125, protein: 1.5, carbs: 22, fats: 4, servingSize: '1 piece (30g)' },
    { name: 'Gulab Jamun (2 pieces)', calories: 250, protein: 3, carbs: 44, fats: 8, servingSize: '2 pieces (60g)' },
    { name: 'Rasgulla (1 piece)', calories: 98, protein: 1.5, carbs: 20, fats: 0.5, servingSize: '1 piece (25g)' },
    { name: 'Jalebi', calories: 165, protein: 1.5, carbs: 32, fats: 4, servingSize: '1 piece (30g)' },
    { name: 'Rasmalai (1 piece)', calories: 115, protein: 4, carbs: 14, fats: 5, servingSize: '1 piece (40g)' },
    { name: 'Barfi (1 piece)', calories: 135, protein: 2, carbs: 22, fats: 5, servingSize: '1 piece (25g)' },
    { name: 'Kaju Katli (1 piece)', calories: 120, protein: 2, carbs: 18, fats: 5, servingSize: '1 piece (20g)' },
    { name: 'Ladoo (1 piece)', calories: 150, protein: 2, carbs: 24, fats: 6, servingSize: '1 piece (30g)' },
    { name: 'Motichoor Ladoo (1 piece)', calories: 130, protein: 2, carbs: 20, fats: 5, servingSize: '1 piece (25g)' },
    { name: 'Halwa (Sooji)', calories: 250, protein: 4, carbs: 38, fats: 10, servingSize: '100g' },
    { name: 'Gajar Halwa', calories: 280, protein: 4, carbs: 42, fats: 12, servingSize: '100g' },
    { name: 'Moong Dal Halwa', calories: 350, protein: 8, carbs: 40, fats: 18, servingSize: '100g' },
    { name: 'Kheer', calories: 130, protein: 4, carbs: 22, fats: 3.5, servingSize: '100g' },
    { name: 'Phirni', calories: 145, protein: 4, carbs: 26, fats: 3, servingSize: '100g' },
    { name: 'Shrikhand', calories: 210, protein: 6, carbs: 30, fats: 8, servingSize: '100g' },
    { name: 'Malpua', calories: 320, protein: 4, carbs: 45, fats: 14, servingSize: '100g' },
    { name: 'Gujiya', calories: 380, protein: 6, carbs: 50, fats: 18, servingSize: '100g' },
    { name: 'Sandesh', calories: 185, protein: 8, carbs: 22, fats: 7, servingSize: '100g' },
    { name: 'Ras Malai', calories: 180, protein: 6, carbs: 24, fats: 7, servingSize: '100g' },
    { name: 'Ghevar', calories: 380, protein: 6, carbs: 48, fats: 20, servingSize: '100g' },
    { name: 'Imarti', calories: 340, protein: 2, carbs: 65, fats: 8, servingSize: '100g' },
    
    // ==================== BEVERAGES ====================
    { name: 'Masala Chai', calories: 65, protein: 2, carbs: 10, fats: 2, servingSize: '1 cup (150ml)' },
    { name: 'Filter Coffee', calories: 55, protein: 2, carbs: 8, fats: 2, servingSize: '1 cup (150ml)' },
    { name: 'Cutting Chai', calories: 45, protein: 1.5, carbs: 6, fats: 1.5, servingSize: '1 cup (75ml)' },
    { name: 'Lassi (Sweet)', calories: 125, protein: 5, carbs: 20, fats: 3, servingSize: '1 glass (250ml)' },
    { name: 'Lassi (Salted)', calories: 95, protein: 5, carbs: 12, fats: 3, servingSize: '1 glass (250ml)' },
    { name: 'Mango Lassi', calories: 160, protein: 5, carbs: 30, fats: 3, servingSize: '1 glass (250ml)' },
    { name: 'Chaas / Buttermilk', calories: 40, protein: 2, carbs: 5, fats: 1.5, servingSize: '1 glass (250ml)' },
    { name: 'Thandai', calories: 180, protein: 6, carbs: 28, fats: 6, servingSize: '1 glass (250ml)' },
    { name: 'Falooda', calories: 280, protein: 6, carbs: 45, fats: 8, servingSize: '1 glass (300ml)' },
    { name: 'Jaljeera', calories: 35, protein: 0, carbs: 8, fats: 0, servingSize: '1 glass (250ml)' },
    { name: 'Nimbu Pani (Lemonade)', calories: 50, protein: 0, carbs: 13, fats: 0, servingSize: '1 glass (250ml)' },
    { name: 'Aam Panna', calories: 60, protein: 0, carbs: 15, fats: 0, servingSize: '1 glass (250ml)' },
    
    // ==================== RAITA & SIDES ====================
    { name: 'Boondi Raita', calories: 85, protein: 4, carbs: 8, fats: 4, servingSize: '100g' },
    { name: 'Cucumber Raita', calories: 45, protein: 3, carbs: 5, fats: 2, servingSize: '100g' },
    { name: 'Mix Veg Raita', calories: 55, protein: 4, carbs: 6, fats: 2, servingSize: '100g' },
    { name: 'Onion Raita', calories: 50, protein: 3, carbs: 5, fats: 2.5, servingSize: '100g' },
    { name: 'Pachadi', calories: 65, protein: 2, carbs: 8, fats: 3, servingSize: '100g' },
    { name: 'Pickle (Achar)', calories: 80, protein: 0.5, carbs: 8, fats: 5, servingSize: '1 tbsp (15g)' },
    { name: 'Papad (Roasted)', calories: 60, protein: 3, carbs: 10, fats: 1, servingSize: '1 piece (10g)' },
    { name: 'Chutney (Coconut)', calories: 75, protein: 1.5, carbs: 6, fats: 5, servingSize: '2 tbsp (30g)' },
    { name: 'Chutney (Mint)', calories: 35, protein: 1, carbs: 6, fats: 1, servingSize: '2 tbsp (30g)' },
    { name: 'Chutney (Tamarind)', calories: 55, protein: 0.5, carbs: 14, fats: 0, servingSize: '2 tbsp (30g)' },
    { name: 'Salad (Mixed)', calories: 25, protein: 1, carbs: 5, fats: 0.2, servingSize: '100g' },
    { name: 'Kachumber Salad', calories: 30, protein: 1, carbs: 6, fats: 0.3, servingSize: '100g' },
    
    // ==================== COMMON INTERNATIONAL ====================
    { name: 'Chicken Breast (Grilled)', calories: 165, protein: 31, carbs: 0, fats: 3.6, servingSize: '100g' },
    { name: 'Chicken Thigh (Grilled)', calories: 209, protein: 26, carbs: 0, fats: 10.9, servingSize: '100g' },
    { name: 'Boiled Eggs', calories: 155, protein: 13, carbs: 1.1, fats: 11, servingSize: '2 eggs (100g)' },
    { name: 'Fried Eggs', calories: 196, protein: 14, carbs: 1, fats: 15, servingSize: '2 eggs' },
    { name: 'Omelette (2 eggs)', calories: 190, protein: 13, carbs: 2, fats: 15, servingSize: '1 omelette' },
    { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fats: 0.7, servingSize: '100g' },
    { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fats: 0.3, servingSize: '1 medium (100g)' },
    { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fats: 0.2, servingSize: '1 medium (150g)' },
    { name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fats: 0.1, servingSize: '1 medium (130g)' },
    { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fats: 50, servingSize: '30g' },
    { name: 'Walnuts', calories: 654, protein: 15, carbs: 14, fats: 65, servingSize: '30g' },
    { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fats: 50, servingSize: '2 tbsp (32g)' },
    { name: 'Honey', calories: 304, protein: 0.3, carbs: 82, fats: 0, servingSize: '1 tbsp (21g)' },
    { name: 'Jaggery (Gur)', calories: 383, protein: 0.4, carbs: 95, fats: 0.1, servingSize: '1 piece (20g)' },
    { name: 'Sugar', calories: 387, protein: 0, carbs: 100, fats: 0, servingSize: '1 tsp (4g)' },
    { name: 'Ghee', calories: 900, protein: 0, carbs: 0, fats: 100, servingSize: '1 tbsp (15g)' },
    { name: 'Butter', calories: 717, protein: 0.9, carbs: 0.1, fats: 81, servingSize: '1 tbsp (14g)' },
    { name: 'Olive Oil', calories: 884, protein: 0, carbs: 0, fats: 100, servingSize: '1 tbsp (15ml)' },
    { name: 'Coconut Oil', calories: 862, protein: 0, carbs: 0, fats: 100, servingSize: '1 tbsp (15ml)' },
    { name: 'Whole Milk', calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3, servingSize: '100ml' },
    { name: 'Low Fat Milk', calories: 42, protein: 3.4, carbs: 5, fats: 1, servingSize: '100ml' },
    { name: 'Toned Milk', calories: 58, protein: 3.2, carbs: 4.8, fats: 3, servingSize: '100ml' },
    { name: 'Paneer (Cottage Cheese)', calories: 265, protein: 18, carbs: 1.2, fats: 21, servingSize: '100g' },
    { name: 'Tofu', calories: 76, protein: 8, carbs: 1.9, fats: 4.8, servingSize: '100g' },
    { name: 'Brown Rice (Cooked)', calories: 111, protein: 2.6, carbs: 23, fats: 0.9, servingSize: '100g' },
    { name: 'Quinoa (Cooked)', calories: 120, protein: 4.4, carbs: 21, fats: 1.9, servingSize: '100g' },
    { name: 'Oats (Cooked)', calories: 68, protein: 2.4, carbs: 12, fats: 1.4, servingSize: '100g' },
    { name: 'Sweet Potato (Boiled)', calories: 86, protein: 1.6, carbs: 20, fats: 0.1, servingSize: '100g' },
    { name: 'Broccoli (Steamed)', calories: 35, protein: 2.8, carbs: 7, fats: 0.4, servingSize: '100g' },
    { name: 'Spinach (Cooked)', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, servingSize: '100g' },
    { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fats: 15, servingSize: '100g' },
    { name: 'Salmon (Grilled)', calories: 208, protein: 20, carbs: 0, fats: 13, servingSize: '100g' },
    { name: 'Tuna (Canned)', calories: 132, protein: 28, carbs: 0, fats: 1, servingSize: '100g' },
    { name: 'Oatmeal', calories: 68, protein: 2.4, carbs: 12, fats: 1.4, servingSize: '100g' },
    { name: 'Whole Wheat Bread', calories: 247, protein: 13, carbs: 41, fats: 3.4, servingSize: '100g' },
    { name: 'Multigrain Bread', calories: 250, protein: 12, carbs: 43, fats: 3.5, servingSize: '100g' },
    { name: 'White Bread', calories: 265, protein: 9, carbs: 49, fats: 3.2, servingSize: '100g' },
    { name: 'Cornflakes', calories: 357, protein: 7.5, carbs: 84, fats: 0.4, servingSize: '100g' },
    { name: 'Muesli', calories: 360, protein: 11, carbs: 67, fats: 6, servingSize: '100g' },
    { name: 'Granola Bar', calories: 450, protein: 8, carbs: 60, fats: 18, servingSize: '100g' },
    { name: 'Protein Shake', calories: 120, protein: 25, carbs: 5, fats: 1, servingSize: '1 scoop (30g)' },
    { name: 'Whey Protein', calories: 125, protein: 24, carbs: 3, fats: 1.5, servingSize: '1 scoop (30g)' },
    { name: 'Multivitamin Tablet', calories: 5, protein: 0, carbs: 1, fats: 0, servingSize: '1 tablet' },
    { name: 'Green Tea', calories: 1, protein: 0, carbs: 0, fats: 0, servingSize: '1 cup (200ml)' },
    { name: 'Black Coffee', calories: 2, protein: 0, carbs: 0, fats: 0, servingSize: '1 cup (200ml)' },
    { name: 'Coconut Water', calories: 19, protein: 0.7, carbs: 4, fats: 0.2, servingSize: '100ml' },
    { name: 'Protein Bar', calories: 350, protein: 20, carbs: 30, fats: 15, servingSize: '1 bar (60g)' },
    { name: 'Dates (Khajoor)', calories: 282, protein: 2.5, carbs: 75, fats: 0.4, servingSize: '100g' },
    { name: 'Figs (Anjeer)', calories: 74, protein: 0.8, carbs: 19, fats: 0.3, servingSize: '100g' },
    { name: 'Raisins', calories: 299, protein: 3.1, carbs: 79, fats: 0.5, servingSize: '100g' },
    { name: 'Cashews', calories: 553, protein: 18, carbs: 30, fats: 44, servingSize: '30g' },
    { name: 'Pistachios', calories: 560, protein: 20, carbs: 28, fats: 45, servingSize: '30g' },
    { name: 'Peanuts', calories: 567, protein: 26, carbs: 16, fats: 49, servingSize: '30g' },
    { name: 'Dried Apricots', calories: 241, protein: 3.4, carbs: 63, fats: 0.5, servingSize: '100g' },
    { name: 'Chia Seeds', calories: 486, protein: 17, carbs: 42, fats: 31, servingSize: '30g' },
    { name: 'Flax Seeds', calories: 534, protein: 18, carbs: 29, fats: 42, servingSize: '30g' },
    { name: 'Sunflower Seeds', calories: 584, protein: 21, carbs: 20, fats: 51, servingSize: '30g' },
    { name: 'Pumpkin Seeds', calories: 559, protein: 30, carbs: 11, fats: 49, servingSize: '30g' }
  ];

  const searchTerm = query.toLowerCase().trim();
  
  const results = mockFoods.filter(food => {
    const name = food.name.toLowerCase();
    return name.includes(searchTerm) || 
           searchTerm.split(' ').every(term => name.includes(term)) ||
           name.split(' ').some(word => word.startsWith(searchTerm));
  }).slice(0, 20);

  return results;
};

module.exports = {
  searchFood
};
