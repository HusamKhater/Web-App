package example.model;


/**
 * 
 * 	this class implements the subscriber object,
 * @author Ayman&Husam
 *
 */
public class Subscriber {

	
	public String ChannelName;
	public String Nickname;
	public String Description;
	public int NumberOfSubscribers;
	public int Unread;
	public int Mention;
	
	/**
	 * 	this constructor construct the subscriber object, we have to save all this data in order to apply a search by nickname, and the the unread/mention of this user in this channel
	 * @param name	the channel name of the subscribed channel
	 * @param nickname	the user nick name that subscribed this channel
	 * @param desc	the description of this channel
	 * @param numberofsub	the number of subscribers to this channel
	 * @param unread	the number of the unread messages to this user in the channel with the given channel name
	 * @param mention	the number of the mentions of this user in this channel
	 */
	public Subscriber(String name, String nickname, String desc, int numberofsub, int unread, int mention){
		
		ChannelName = name;
		Nickname = nickname;
		Description = desc;
		NumberOfSubscribers = numberofsub;
		Unread = unread;
		Mention = mention;
	}
	
	/**
	 * 	this method return the channel name
	 * @return	the channel name that subscribed
	 */
	public String getChannelName() {
		return ChannelName;
	}

	/**
	 * 	this method return the user nickname 
	 * @return	the user nickname that subscribed
	 */
	public String getNickname() {
		return Nickname;
	}
	
	/**
	 * 
	 * @return	the description of this channel
	 */
	public String getDescription() {
		return Description;
	}
	
	/**
	 * 
	 * @return	number of subscribers to this channel
	 */
	public int getNumberOfSubscribers(){
		return NumberOfSubscribers;
	}
	
	/**
	 * 
	 * @return	the number unread messages of this user in this channel
	 */
	public int getUnread(){
		return Unread;
	}
	
	/**
	 * 
	 * @return	the number of mentiones messages of this user in this channel
	 */
	public int getMention(){
		return Mention;
	}
}
