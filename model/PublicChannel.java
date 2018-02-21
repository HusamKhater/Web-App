package example.model;


/**
 * 
 * 	this class implements the public channel object, it contain the name of public channel and its description
 * 
 * @author Ayman&Husam
 *
 */

public class PublicChannel {

	public String ChannelName;
	public String Description;
	public int NumberOfSubscribers;
	
	/**
	 * 
	 *	 this is the cons. of this object,
	 * 
	 * @param name	 it takes the name of the created public channel
	 * @param desc	 it takes the description of the created public channel
	 * @param num	 it will hold the number of subscribers of this channel 
	 */
	public PublicChannel(String name, String desc, int num){
		
		ChannelName = name;
		Description = desc;
		NumberOfSubscribers = num;
		
	}
	
	
	/**
	 * 	this method return the public channel name
	 * @return	 the public channel name
	 */
	public String getChannelName() {
		return ChannelName;
	}
	
	/**
	 * 	this method return the public channel description
	 * @return 	the public channel description
	 */
	public String getDescription() {
		return Description;
	}

	
}
