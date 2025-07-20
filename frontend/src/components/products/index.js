import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // ✅ use axios instead of fetch
import ProductItem from '../ProductItem';
import Header from '../Header';

const ProductsContainer = styled.div`
  margin-top: 10vh;
  padding: 20px;
  text-align: start;
`;

const Heading = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  margin-top: 40px;
`;

const StyledList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 20px;
  max-width: 270px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const CategoryFilter = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-top: 30px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Products = () => {
  const api = `${process.env.REACT_APP_BACKEND_URL}/products`; // ✅ .env based
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    axios.get(api)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('❌ Error fetching products:', err);
        alert('Backend not reachable. Please make sure it is running on port 5100.');
      });
  }, [api]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const nameMatches = product.productname.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatches =
      selectedCategory === 'all' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    return nameMatches && categoryMatches;
  });

  const categories = ['all', ...new Set(products.map((p) => p.category.toLowerCase()))];

  return (
    <div>
      <Header />
      <ProductsContainer>
        <FiltersContainer>
          <div className='w-100'>
            <h3>Search By Product Name</h3>
            <SearchBar
              type="text"
              placeholder="Search by product name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className='w-100'>
            <h3>Filter By Category</h3>
            <CategoryFilter value={selectedCategory} onChange={handleCategoryChange}>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </CategoryFilter>
          </div>
        </FiltersContainer>

        <Heading>Products</Heading>
        <StyledList>
          {filteredProducts.map((product) => (
            <ListItem key={product._id}>
              <ProductItem
                id={product._id}
                img={product.image}
                name={product.productname}
                description={product.description}
                price={product.price}
              />
            </ListItem>
          ))}
        </StyledList>
      </ProductsContainer>
    </div>
  );
};

export default Products;


