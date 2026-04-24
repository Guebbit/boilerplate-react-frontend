import { Link } from 'react-router-dom';

export const UsersListPage = () => (
    <section id='users-list-page' className='item-list-page'>
        <h1>Users</h1>
        <p>
            <Link to='/users/create'>Create user</Link>
        </p>
        <ul>
            {[1, 2, 3].map((id) => (
                <li key={id}>
                    <Link to={`/users/${id}`}>User #{id}</Link>
                </li>
            ))}
        </ul>
    </section>
);
