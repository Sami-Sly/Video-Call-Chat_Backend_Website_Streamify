import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
const CreateGroupForm = () => {
  const { authUser } = useAuthUser();
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!groupName || selected.length < 2) {
      toast.error("Enter group name and select at least 2 friends");
      return;
    }

    try {
const res = await axios.post(
  "http://localhost:5001/api/users/group/create",
  {
    name: groupName,
    members: selected,
  },
  {
    withCredentials: true, // IMPORTANT if you're using cookies for auth
  }
);


      toast.success("Group created!");
      navigate(`/group-chat/${res.data.streamChannelId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating group");
    }
  };

  const selectedFriends = friends.filter((f) => selected.includes(f._id));
  return (
   <div className="mx-4">
  <div className="p-6 max-w-md mx-auto mt-10 rounded-lg shadow-sm bg-base-200 text-base-content border border-base-300">
    <h2 className="text-2xl font-bold text-center mb-6">
      🚀 Create Group Chat
    </h2>

    <input
      type="text"
      placeholder="Enter group name"
      value={groupName}
      onChange={(e) => setGroupName(e.target.value)}
      className="input input-bordered w-full mb-5"
    />

    {/* Selected Members */}
    <AnimatePresence>
      {selectedFriends.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          {selectedFriends.map((f) => (
            <div
              key={f._id}
              onClick={() => toggleSelect(f._id)}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-base-300 cursor-pointer hover:bg-base-100 transition-all"
            >
              <img src={f.profilePic} className="w-6 h-6 rounded-full" alt={f.fullName} />
              <span className="text-sm">{f.fullName}</span>
              <span className="text-sm font-bold">&times;</span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>

    {/* Friends List */}
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
      {friends.map((f) => (
        <motion.div
          key={f._id}
          whileHover={{ scale: 1.02 }}
          onClick={() => toggleSelect(f._id)}
          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            selected.includes(f._id)
              ? "bg-base-300"
              : "hover:bg-base-100"
          }`}
        >
          <img src={f.profilePic} className="w-8 h-8 rounded-full" alt={f.fullName} />
          <span className="font-medium">{f.fullName}</span>
        </motion.div>
      ))}
    </div>

    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleSubmit}
      className="btn btn-primary mt-6 w-full"
    >
      Create Group
    </motion.button>
  </div>
</div>

    // <div className="p-4   max-w-md mx-auto mt-4">
    //   <h2 className="text-xl font-semibold mb-3">Create Group Chat</h2>
    //   <input
    //     type="text"
    //     placeholder="Group name"
    //     value={groupName}
    //     onChange={(e) => setGroupName(e.target.value)}
    //     className="w-full border p-2 rounded mb-4"
    //   />
    //   <div className="space-y-2 max-h-60 overflow-y-auto">
    //     {friends.map((f) => (
    //       <label key={f._id} className="flex items-center gap-2">
    //         <input
    //           type="checkbox"
    //           checked={selected.includes(f._id)}
    //           onChange={() => toggleSelect(f._id)}
    //         />
    //         <img src={f.profilePic} className="w-6 h-6 rounded-full" />
    //         <span>{f.fullName}</span>
    //       </label>
    //     ))}
    //   </div>
    //   <button
    //     onClick={handleSubmit}
    //     className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
    //   >
    //     Create Group
    //   </button>
    // </div>
  );
};

export default CreateGroupForm;
