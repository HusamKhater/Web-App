package example;

import java.lang.reflect.Type;
import java.util.Collection;

import com.google.gson.reflect.TypeToken;


import example.model.Message;
import example.model.PublicChannel;
import example.model.Subscriber;
import example.model.User;

/**
 * A simple place to hold global application constants such as SQL statements and constant
 */
public interface AppConstants {

	
	/**
	 * constant
	 */
	public final String USERS = "users";
	
	
	/**
	 *  constant
	 */
	public final String NAME = "name";
	
	/**
	 * we use it if we have to load users from external file, we didn't use it but we have this option if any one have to
	 */
	public final String USERS_FILE = USERS + ".json";
	
	
	// collection constants, we use this collections in order to return a collection of a suitable object from the servlet to the client side 
	
	
	/**
	 * Users object collection
	 */
	public final Type USER_COLLECTION = new TypeToken<Collection<User>>() {}.getType();
	
	/**
	 * Public Channel object collection
	 */
	public final Type PUBLIC_CHANNEL_COLLECTION = new TypeToken<Collection<PublicChannel>>() {}.getType();
	
	/**
	 * Subscriber object collection
	 */
	public final Type SUBSCRIBER_COLLECTION = new TypeToken<Collection<Subscriber>>() {}.getType();
	
	/**
	 * Message object collection
	 */
	public final Type MESSAGE_COLLECTION = new TypeToken<Collection<Message>>() {}.getType();
	
	/**
	 * String collection
	 */
	public final Type STRING_COLLECTION = new TypeToken<Collection<String>>() {}.getType();

	
	//derby constants
	public final String DB_NAME = "DB_NAME";
	public final String DB_DATASOURCE = "DB_DATASOURCE";
	public final String PROTOCOL = "jdbc:derby:"; 
	public final String OPEN = "Open";
	public final String SHUTDOWN = "Shutdown";
	
	
	
	//sql statements
	
	/**
	 * 	create users table
	 */
	public final String CREATE_USERS_TABLE = "CREATE TABLE USERS(Username varchar(10)not null,"
			+ "Password varchar(8) not null,"
			+ "Nickname varchar(20) not null,"
			+ "ImgUrl varchar(1000),"
			+ ""
			+ "Description varchar(50),unique(Username, Password, nickname), primary key(Username))";
	
	/**
	 * 	create public channels table
	 */
	public final String CREATE_PUBLIC_CHANNELS_TABLE = "CREATE TABLE PUBLIC_CHANNELS(ChannelName varchar(30)not null,"
			+ "Description varchar(500) not null,"
			+ "NumberOfSubscribers integer,"
			+"primary key(ChannelName))";
	
	
	/**
	 * 	create subscribers table
	 */
	public final String CREATE_SUBSCRIBERS_TABLE = "CREATE TABLE SUBSCRIBERS(ChannelName varchar(30)not null,"
			+ "Nickname varchar(20) not null,"
			+ "Description varchar(500),"
			+ "NumberOfSubscribers integer,"
			+ "Unread integer,"
			+ "Mention integer,"
			+ "Timestamp timestamp not null"
			+ ")";
	
	/**
	 * 	create messages table
	 */
	public final String CREATE_MESSAGES_TABLE = "CREATE TABLE MESSAGES(UserNickname varchar(20)not null,"
			+ "ImgUrl varchar(1000) not null,"
			+ "Content varchar(500) not null,"
			+"Id integer not null generated always as identity (start with 1, increment by 1),"
			+"Parent integer not null,"
			+"FirstParent integer not null,"
			+"Timestamp timestamp not null,"
			+"OredTimestamp timestamp not null,"
			+"ChannelName varchar(30) not null"
			+")";
	
	/**
	 * 	create private channel table
	 */
	public final String CREATE_PRIVATE_CAHNNELS_TABLE = "CREATE TABLE PRIVATE_CHANNELS(PrivateChannelName varchar(41)not null,"
			+	"primary key(PrivateChannelName))";
	
	
	
	
	/**
	 * 	insert a User to the table
	 */
	public final String INSERT_USER_STMT = "INSERT INTO USERS VALUES(?,?,?,?,?)";
	
	/**
	 * 	insert a Public Channel to the table
	 */
	public final String INSERT_PUBLIC_CHANNEL_STMT = "INSERT INTO PUBLIC_CHANNELS VALUES(?,?,?)";
	
	/**
	 * 	insert a Subscriber to the table
	 */
	public final String INSERT_SUBSCRIBER_STMT = "INSERT INTO SUBSCRIBERS VALUES(?,?,?,?,?,?,?)";
	
	
	/**
	 * 	insert a Message to the table
	 */
	public final String INSERT_MESSAGE_STMT = "INSERT INTO MESSAGES (UserNickname,ImgUrl,Content,Parent,FirstParent,Timestamp,OredTimestamp ,ChannelName) VALUES(?,?,?,?,?,?,?,?)";
	
	/**
	 * 	insert a Private Channel to the table
	 */
	public final String INSERT_PRIVATE_CHANNEL_STMT = "INSERT INTO PRIVATE_CHANNELS VALUES(?)";
	
	
	
	/**
	 * 	delete a Subscriber object from the table
	 */
	public final String DELETE_SUBSCRIBER_STMT = "DELETE FROM SUBSCRIBERS WHERE ChannelName=? AND Nickname=?";
	
	/**
	 * 	changing the ordered time stamp of message with the given id, in order to change its location at the chat area according to the thread view
	 */
	public final String CHANGE_ORDERTIMESTAMP_STMT = "update MESSAGES set OredTimestamp=? where Id=?";
	
	/**
	 * 	change the number of subscribers to the given public channel name, we use it once we subscribe a channel and we want to change the number of subscribers of a public channel
	 */
	public final String SET_NUMBEROFSUBSCRIBERS_STMT = "update PUBLIC_CHANNELS set NumberOfSubscribers=? where ChannelName=?";
	
	/**
	 * 	increments the field number of subscribers in the subscribers table to all the objects there with the given channel name
	 */
	public final String INC_SUB_TABLE_NUM_OF_SUBS_BY_CANNELNAME_STMT = 
			"update SUBSCRIBERS set NumberOfSubscribers = NumberOfSubscribers + 1 where ChannelName=?";
	
	/**
	 * 	decrements the field number of subscribers in the subscribers table to all the objects there with the given channel name
	 */
	public final String DEC_SUB_TABLE_NUM_OF_SUBS_BY_CANNELNAME_STMT = 
			"update SUBSCRIBERS set NumberOfSubscribers = NumberOfSubscribers - 1 where ChannelName=?";
	
	/**
	 *  increments the number of unread field in the subscribers table to all the objects with the given channel name, used when we write a message in any channel discussion 
	 */
	public final String INC_UNREAD_OF_SUBS_BY_CANNELNAME_STMT = 
			"update SUBSCRIBERS set Unread = Unread + 1 where ChannelName=?";
	
	/**
	 * 	zero the unread field in the subscribers table to the given channel name and nick name, used when we have to open a channel discussion or when we are chats in the current channel
	 */
	public final String ZERO_UNREAD_OF_SUBS_BY_CANNELNAME_AND_NICKNAME_STMT = 
			"update SUBSCRIBERS set Unread = 0, Mention=0 where ChannelName=? AND Nickname=?";
	
	/**
	 * 	changing the number the mention field in the subscribers table to the given channel name and user nickname, used when we mention any subscriber to the current channel
	 */
	public final String SET_MENTION_OF_SUBS_BY_CANNELNAME_STMT = 
			"update SUBSCRIBERS set Mention = 1 where ChannelName=? AND Nickname=?";
	
	/**
	 * select all the Users 
	 */
	public final String SELECT_ALL_USERS_STMT = "SELECT * FROM USERS";
	
	/**
	 * select all the Public Channels 
	 */
	public final String SELECT_ALL_PUBLIC_CHANNELS_STMT = "SELECT * FROM PUBLIC_CHANNELS";
	
	/**
	 * select all the Subscribers 
	 */
	public final String SELECT_ALL_SUBSCRIBERS_STMT = "SELECT * FROM SUBSCRIBERS";
	
	/**
	 * select a specific User according to his user name 
	 */
	public final String SELECT_USER_BY_NAME_STMT = "SELECT * FROM USERS "
			+ "WHERE Username=?";
	
	/**
	 * select a specific User according to his nickname 
	 */
	public final String SELECT_USER_BY_NICKNAME_STMT = "SELECT * FROM USERS "
			+ "WHERE Nickname=?";
	
	/**
	 * select a specific Public channel according to its channel name 
	 */
	public final String SELECT_PUBLIC_CHANNELS_BY_CHANNELNAME_STMT = "SELECT * FROM PUBLIC_CHANNELS "
			+ "WHERE ChannelName=?";
	
	/**
	 * select a specific Subscriber according to its user nickname 
	 */
	public final String SELECT_SUBSCRIBED_BY_NICKNAME_STMT = "SELECT * FROM SUBSCRIBERS "
			+ "WHERE Nickname=?";
	
	/**
	 * select a specific Subscriber according to its nickname and channel name  
	 */
	public final String SELECT_SUBSCRIBED_BY_NICKNAME_AND_CHANNELNAME_STMT = "SELECT * FROM SUBSCRIBERS "
			+ "WHERE Nickname=? AND ChannelName=?";
	
	/**
	 * select a specific Message according to its channel name and the first parent = 0 (main message not a reply) 
	 */
	public final String SELECT_MESSAGES_BY_CHANNELNAME_STMT = "SELECT * FROM MESSAGES "
			+ "WHERE ChannelName=? AND FirstParent=0 ORDER BY OredTimestamp ASC";
	
	/**
	 * select a specific Message according to its parent (the replies of given message id) 
	 */
	public final String SELECT_MESSAGES_BY_PARENT_STMT = "SELECT * FROM MESSAGES "
			+ "WHERE Parent=?";
	
	/**
	 * select a specific Message according to its unique id 
	 */
	public final String SELECT_MESSAGE_BY_ID_STMT = "SELECT * FROM MESSAGES "
			+ "WHERE Id=?"; 
	
	/**
	 * select a specific Private channel according to its name 
	 */
	public final String SELECT_PRIVATE_CHANNEL_STMT = "SELECT * FROM PRIVATE_CHANNELS "
			+ "WHERE PrivateChannelName=?";

	
	
}
