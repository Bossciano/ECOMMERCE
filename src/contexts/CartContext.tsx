// Add this function inside CartProvider
const syncCartToDatabase = async (items: CartItem[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return; // Only sync for logged-in users

  // Delete existing cart items
  await supabase
    .from('user_carts')
    .delete()
    .eq('user_id', user.id);

  // Insert new cart items
  if (items.length > 0) {
    const cartItems = items.map(item => ({
      user_id: user.id,
      product_id: item.id,
      quantity: item.quantity
    }));

    await supabase
      .from('user_carts')
      .insert(cartItems);
  }
};

// Call syncCartToDatabase whenever items change
useEffect(() => {
  syncCartToDatabase(items);
}, [items]);
