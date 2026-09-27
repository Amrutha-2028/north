import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Landing from "./Landing";
import Dashboard from "./Dashboard";

function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b1626",
        }}
      />
    );
  }

  return session ? <Dashboard /> : <Landing />;
}

export default Home;
