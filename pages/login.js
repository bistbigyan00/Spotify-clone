import { getProviders, signIn } from "next-auth/react";

// providers from below export async
function login({ providers }) {
    return (
        <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
           <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />

        {/* providers can be anything, spotify, google, github, etc */}
        {Object.values(providers).map((provider)=>(
            <div key={provider.name}>
                <button className="bg-[#18D860] text-white p-5 rounded-lg"
                onClick={()=>signIn(provider.id,{ callbackUrl:"/"})}
                >Login with {provider.name}</button>
            </div>
        ))}

        </div>
    );
}

export default login
 

// server side render from next auth: before this page loads, we render the services
//this will run on the server before this page loads, everytime
export async function getServerSideProps(){
    const providers = await getProviders();
    return {
        props: {
            providers,
        }
    }
}