import {useRef, useState} from "react";
import {auth} from "../lib/firebase";
import toast from "react-hot-toast";

export default function RestPasswordPage({ }) {
  return (
      <main>
        <ResetPassword>
        </ResetPassword>
      </main>
  )
}

function ResetPassword(e) {
    const [loading, setLoading] = useState(false);
    const email = useRef();

    const resetpw = async (e) => {
        e.preventDefault();

        try {
            await auth.sendPasswordResetEmail(email.current.value).then(() => {
                toast.success('Reset Mail has been send!')
            });
        } catch {
            toast.error('Failed there is no Account with this E-Mail');
        }

    } 

    return (
    <form onSubmit={resetpw}>
    <input type="email" placeholder="E-Mail" ref={email}></input>
    <button disabled={loading}>Password zurücksetzen</button>
</form>
);
}