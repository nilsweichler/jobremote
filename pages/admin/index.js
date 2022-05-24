import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import AdminCheck from '../../components/AdminCheck';
import CompanyFeed from '../../components/CompanyFeed';
import { UserContext } from '../../lib/context';
import { firestore, auth, serverTimestamp } from '../../lib/firebase';

import {useCallback, useContext, useState, useEffect} from "react";
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import slugify from 'slugify';
import toast from 'react-hot-toast';

import debounce from 'lodash.debounce';

import Sidebar from '../../components/Sidebar';

export default function AdminPostsPage(props) {
    return (
        <>
        <Sidebar activePath='/admin'></Sidebar>
        <main className='withSidebar'>
            <AdminCheck admin={true}>
                <p>Test</p>
            </AdminCheck>
            <AuthCheck>
                <p>You have --- Job Posts</p>
            </AuthCheck>
        </main>
        </>
    );
}
