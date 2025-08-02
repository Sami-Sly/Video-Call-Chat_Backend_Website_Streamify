import React from 'react'
import { getGroupChannel } from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
function AllGroups() {

    const navigate = useNavigate();
  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroupChannel,
  });
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
  <h2 className="text-4xl font-extrabold text-base-content mb-10 text-center">
    💬 Your Group Chats
  </h2>

  {loadingGroups ? (
    <div className="flex justify-center items-center h-40 text-base-content/60">
      Loading group chats...
    </div>
  ) : groups.length === 0 ? (
    <div className="text-center italic text-base-content/60 text-lg">
      You're not in any groups yet.
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {groups.map((group, index) => (
        <motion.div
          key={group._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          onClick={() => navigate(`/group-chat/${group.streamChannelId}`)}
          className="cursor-pointer rounded-xl bg-base-200 border border-base-300 hover:border-primary hover:shadow-md transition-all duration-300 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xl shadow-md">
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-base-content">
                {group.name}
              </h3>
              <p className="text-sm text-base-content/70 mt-1">
                {group.members?.length} member
                {group.members?.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )}
</div>

  )
}

export default AllGroups
