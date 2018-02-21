package example.model;


import java.sql.Timestamp;


/**
 * 
 * 	This class implements message class, it contain all the details that we need to represent the message in our implementation
 * 
 * @author Ayman&husam
 *
 */

public class Message {

	/**
	 * 
	 * 	all the field set as public in order to take them value with out functions. 
	 * 
	 */
	public String UserNickname;
	public String ImageUrl;
	public String Content;
	public int Id;
	public int Parent;
	public int FirstParent;
	public Timestamp Timestamp;
	public Timestamp OredTimestamp;
	public String ChannelName;
	
	/**
	 * 	this is the cons. of this class, here we can create a message as an object 
	 * @param name	 the user name of the writer
	 * @param url 	the image URL of the writer, in order to show it in the UI
	 * @param con 	the content of the the message, what the message speaks :)
	 * @param id 	this is the identifier of the message, its unique for each message, and it increments in the SQL table
	 * @param parent 	this field saves the message parent, we use it to know each reply belongs to each message, we use it in order to show the exactly
	 * 		  	replies of each message, the first message will save this field 0, and each reply save it as the id of its message 
	 * @param firstP 	this field saves the first parent id, in other words, the main message id, 
	 * 		  	we save this field in order to change the ordered time stamp of the the first message when we write a reply on it
	 * @param t 	this field saves the creation time stamp of message
	 * @param o 	this field saves the last change time on message, used to know where to show the message in the chat box
	 * @param channel	this field saves the name of channel that we belong to it
	 */
	public Message(String name, String url, String con, int id,int parent, int firstP, Timestamp t,Timestamp o, String channel){
		
		UserNickname = name;
		ImageUrl = url;
		Content = con;
		Id = id;
		Parent = parent;
		FirstParent = firstP;
		Timestamp = t;
		OredTimestamp = o;
		ChannelName = channel;
	
	}

}

