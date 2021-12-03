import Sidebar from '../components/Sidebar'
import Center from '../components/Center'
import Player from '../components/Player'
import { getSession } from 'next-auth/react';


export default function Home() {
  return (
    // initial div height of screen, for smooth scroll
    <div className="bg-black h-screen overflow-hidden">
     <main className="flex">
        <Sidebar />
        <Center />
     </main>

     <div className="sticky bottom-0">
        <Player />
     </div>
     
    </div>
  );
}

// it will prefetch the session before and then client side will work
export async function getServerSideProps(context){
  const session = await getSession(context);

  return {
    props:{
      session,
    },
  };
}
