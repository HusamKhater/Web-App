package example.model;

/**
 * 
 * 	this class implements the USER object, it contain the details of user
 * 
 * @author Ayman&Husam
 *
 */
public class User {
	
	private String Username;
	private String Password;
	private String Nickname;
	private String ImgUrl;
	private String Description;
	
	
	/**
	 * 	this is the constructor of the USER class
	 * @param username	the user name of the user, it used in the login time
	 * @param password	the password of the user, it used in the login time
	 * @param nickname	the nickname of the user, it used to show the user all the data that he needs, such as channels, messages ..
	 * @param imgUrl	the image URL of the user
	 * @param description	the description about specific user
	 */
	public User(String username, String password, String nickname, String imgUrl, String description) {
		
		Username = username;
		Password = password;
		Nickname = nickname;
		ImgUrl = imgUrl;
		Description = description;
		
	}

	/**
	 * 	the get user name method
	 * @return the User name of user
	 */
	public String getUsername() {
		return Username;
	}

	/**
	 * 	the get password method
	 * @return the password of user
	 */
	public String getPassword() {
		return Password;
	}

	/**
	 * 	the get nickname of user
	 * @return the nick nam of user
	 */
	public String getNickname() {
		return Nickname;
	}
	
	/**
	 * 	the get image URL of user
	 * @return	the image URL of user
	 */
	public String getImgUrl() {
		return ImgUrl;
	}
	
	/**
	 * 	the get description of user
	 * @return	the description of user
	 */
	public String getDescription() {
		return Description;
	}
	
}
