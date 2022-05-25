import AuthCheck from '../../components/AuthCheck';
import AdminCheck from '../../components/AdminCheck';

import {useCallback, useContext, useState, useEffect} from "react";

import Sidebar from '../../components/Sidebar';
import {auth, firestore} from "../../lib/firebase";
import GridContainer from "../../components/ui-library/Grid/GridContainer";
import GridItem from "../../components/ui-library/Grid/GridItem";

import * as FaIcons from 'react-icons/fa';

export default function AdminPostsPage(props) {

    return (
        <>
            <Sidebar activePath='/admin'></Sidebar>
            <main className='withSidebar'>
                <AuthCheck>
                <AdminCheck admin={true}>
                    <AdminWidgetTotal></AdminWidgetTotal>
                </AdminCheck>
                    <NormalUserWidget></NormalUserWidget>
                </AuthCheck>
            </main>
        </>
    );
}

function AdminWidgetTotal() {
    //get total amount of jobs
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);


    useEffect(() => {
        firestore.collectionGroup('jobs').get().then(snapshot => {
            setTotalJobs(snapshot.size);
        });
    }, []);

    useEffect(() => {
        firestore.collection('users').get().then(snapshot => {
            setTotalUsers(snapshot.size);
        });
    }, []);


    return (
        <>
            <h1>Admin Dashboard</h1>
            <GridContainer>
                <GridItem xs={12} sm={6} md={3}>
                    <div className="dashboard-card">
                        <div className="dashboard-card-img">
                            <FaIcons.FaFileAlt/>
                        </div>
                        <p>{totalJobs} Jobs</p>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={6} md={3}>
                    <div className="dashboard-card">
                        <div className="dashboard-card-img">
                            <FaIcons.FaUser/>
                        </div>
                        <p>{totalUsers} User</p>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={6} md={3}>
                    <div className="dashboard-card">
                        <div className="dashboard-card-img">
                            <FaIcons.FaEye/>
                        </div>
                        <p>123 Nutzer TODO</p>
                    </div>
                </GridItem>
                <GridItem xs={12} sm={6} md={3}>
                    <div className="dashboard-card">
                        <div className="dashboard-card-img">
                            <FaIcons.FaFileAlt/>
                        </div>
                        <p>{totalJobs} TODO</p>
                    </div>
                </GridItem>
            </GridContainer>
        </>
    );
}

function NormalUserWidget() {

    //get amount of users jobs
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalUnpublished, setTotalUnpublished] = useState(0);

useEffect(() => {
    firestore.collection('users').doc(auth.currentUser.uid).collection('jobs').get().then(snapshot => {
        setTotalJobs(snapshot.size);
    });
}, []);

useEffect(() => {
    firestore.collection('users').doc(auth.currentUser.uid).collection('jobs').where('published', '==', false).get().then(snapshot => {
        setTotalUnpublished(snapshot.size);
    });
}, []);


return (
    <>
        <h1>Dashboard</h1>
        <GridContainer>
            <GridItem xs={12} sm={6} md={3}>
                <div className="dashboard-card">
                    <div className="dashboard-card-img">
                        <FaIcons.FaFileAlt/>
                    </div>
                    <p>{totalJobs} Jobs</p>
                </div>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
                <div className="dashboard-card">
                    <div className="dashboard-card-img">
                        <FaIcons.FaClipboardCheck/>
                    </div>
                    <p>{totalUnpublished} in Überprüfung</p>
                </div>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
                <div className="dashboard-card">
                    <div className="dashboard-card-img">
                        <FaIcons.FaEye/>
                    </div>
                    <p>123 Nutzer TODO</p>
                </div>
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
                <div className="dashboard-card">
                    <div className="dashboard-card-img">
                        <FaIcons.FaMousePointer/>
                    </div>
                    <p>{totalJobs} "Bewerben" Clicks TODO</p>
                </div>
            </GridItem>
        </GridContainer>
    </>
);
}
