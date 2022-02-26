import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Component's children only shown to admin users
export default function AdminCheck(props, admin) {
    const { isAdmin } = useContext(UserContext);

    if(admin) {
        return isAdmin ? props.children : props.fallback || null;
    }

    return null;
}