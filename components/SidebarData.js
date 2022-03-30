import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import {useRouter} from 'next/router';



const signOut =  () => {
    const router = useRouter();
    router.push('/')
    auth.signOut();
}

export const SidebarData = [
    {
        title: 'Dashboard',
        path: '/admin',
        icon: <AiIcons.AiFillHome/>,
        cnName: 'nav-text',
        function: '',
    },
    {
        title: 'Job Posts',
        path: '/admin/job-posts',
        icon: <IoIcons.IoIosPaper/>,
        cnName: 'nav-text',
        function: '',
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <AiIcons.AiFillSetting/>,
        cnName: 'nav-text',
        function: '',
    }
]