import { Link } from 'react-router-dom';

const products = [
    { id: 1, title: 'Keyboard', price: 49 },
    { id: 2, title: 'Mouse', price: 25 }
];

export const ProductsListPage = () => (
    <section id='products-list-page' className='item-list-page'>
        <h1>Products</h1>
        <ul>
            {products.map((product) => (
                <li key={product.id}>
                    <Link to={`/products/${product.id}`}>{product.title}</Link> - €{product.price}
                </li>
            ))}
        </ul>
    </section>
);
