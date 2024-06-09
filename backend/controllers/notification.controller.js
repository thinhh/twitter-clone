import Notification from "../models/notification.model.js";
export const getAllNotifications = async (req, res) =>{
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({to: userId}).populate({
            path: 'from',
            select: 'username profileImg',
        })
        await Notification.updateMany({to: userId}, {read: true});
        return res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getAllNotifications controller: ", error.message);
        return res.status(500).json({error: error.message});
    }
} 

export const deleteAllNofications = async(req, res) =>{
    try {
        const userId= req.user._id;
        await Notification.deleteMany({to: userId});
        return res.status(200).json({message: 'Successfully delete all notifications'});
    } catch (error) {
        console.log("Error in deleteAllNotifications controller: ", error.message);
        return res.status(500).json({error: error.message});
    }
}