import { useState } from "react";
import authorImage from "@/assets/author-image.jpg";

export function NotificationPage() {
  const [notifications] = useState([
    {
      id: 1,
      type: "comment",
      user: "Jacob Lash",
      userAvatar: authorImage,
      action: "Commented on your article:",
      article: "The Fascinating World of Cats: Why We Love Our Furry Friends",
      content: "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
      time: "4 hours ago"
    },
    {
      id: 2,
      type: "like",
      user: "Jacob Lash",
      userAvatar: authorImage,
      action: "liked your article:",
      article: "The Fascinating World of Cats: Why We Love Our Furry Friends",
      content: null,
      time: "4 hours ago"
    }
  ]);

  const handleViewNotification = (notificationId) => {
    // In a real app, this would navigate to the article or mark as read
    console.log("Viewing notification:", notificationId);
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notification</h1>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-[#F9F8F6] border-b border-gray-300 p-6">
            <div className="flex items-start space-x-4">
              {/* User Avatar */}
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={notification.userAvatar}
                  alt={notification.user}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                  {notification.user.charAt(0)}
                </div>
              </div>

              {/* Notification Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm">
                      <span className="font-semibold">{notification.user}</span>
                      {" "}
                      <span>{notification.action}</span>
                      {" "}
                      <span className="font-medium text-gray-700">{notification.article}</span>
                    </p>
                    
                    {notification.content && (
                      <p className="text-gray-600 text-sm mt-2 italic">
                        {notification.content}
                      </p>
                    )}
                    
                    <p className="text-[#E8A87C] text-sm mt-2">
                      {notification.time}
                    </p>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => handleViewNotification(notification.id)}
                    className="text-[#26231E] hover:text-gray-600 underline cursor-pointer transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
