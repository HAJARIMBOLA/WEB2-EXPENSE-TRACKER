import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 bg-gray-900 min-h-screen text-white p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">Profile</h1>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <span className="text-gray-400 font-medium">ID:</span> 
            <span className="text-teal-400 font-mono text-sm">{user?.id}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <span className="text-gray-400 font-medium">Email:</span> 
            <span className="text-white">{user?.email}</span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-400 font-medium">Joined:</span> 
            <span className="text-gray-300">
              {user?.createdAt && new Date(user.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">{user?.email}</div>
              <div className="text-gray-400 text-sm">Active User</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}