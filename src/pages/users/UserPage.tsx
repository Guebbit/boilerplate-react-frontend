import { Link, useParams } from 'react-router-dom';

export const UserPage = () => {
    const { id } = useParams();

    return (
        <section>
            <h1>User #{id}</h1>
            <p>User detail placeholder.</p>
            <Link to={`/users/${id}/edit`}>Edit user</Link>
        </section>
    );
};
