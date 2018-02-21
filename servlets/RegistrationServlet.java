package example.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.dbcp.dbcp.BasicDataSource;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import example.AppConstants;


/**
 * Servlet that insert a new user to the DB once registration
 */
@WebServlet("/RegistrationServlet")
public class RegistrationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RegistrationServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		doPost(request,response);
	}

		
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 * @see servlet that insert a new user to the users table
	 * @return json format string message indicate whether the adding success or not(REGISTRATION_FAIL, REGISTRATION_SUCCESS,REGISTRATION_FAIL_MISS_REQUIERD_FIELD, REGISTRATION_FAILED_USED_NICKNAME, REGISTRATION_FAILED_USED_USERNAME)
	 * @throws ServletException, IOException
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
	  	
		StringBuffer sb = new StringBuffer();
	    try 
	    {
	      BufferedReader reader = request.getReader();
	      String line = null;
	      while ((line = reader.readLine()) != null)
	      {
	        sb.append(line);
	      }
	    } catch (Exception e) { e.printStackTrace(); }
		    
	    JsonParser parser = new JsonParser();
	    JsonObject joUser = null;
	    joUser = (JsonObject) parser.parse(sb.toString());
		    
		            
		
	    PrintWriter out = response.getWriter();
		Collection<String> messages = new ArrayList<String>();
		String message = null;
		
	    
	    
	    if(joUser.get("username")==null || joUser.get("password")==null || joUser.get("nickname")==null){
	    	
	    	message = "REGISTRATION_FAIL_MISS_REQUIERD_FIELD";
			messages.add(message);
			Gson gson = new Gson();
			String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
			out.println(result);
			out.close();
			
			return ;
	    	
	    }
	    
  		String username = joUser.get("username").getAsString();
		String password = joUser.get("password").getAsString();
		String nickname = joUser.get("nickname").getAsString();
		
		
		JsonElement j = joUser.get("imgUrl");
		JsonElement h = joUser.get("description");
		
		String imgUrl;
		String description;
		
		if(j == null){
			imgUrl = "http://i.imgur.com/uPBsFJS.png";
		}else{
			imgUrl = j.getAsString();
		}
		
		if(h == null){
			description = "Description unavailable";
		}else{
			description = h.getAsString();
		}
		
		
		
		
		if(username==null ||  password==null || nickname==null){
			
			message = "REGISTRATION_FAILED_NULLNICKNAME";
			messages.add(message);
			Gson gson = new Gson();
			String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
			out.println(result);
			out.close();
		}
		
		if(username=="" ||  password=="" || nickname=="" || username.trim().isEmpty() ||  password.trim().isEmpty() || nickname.trim().isEmpty()){
			
			message = "REGISTRATION_FAILED_YOU_MUST_WRITE_SOMETHING";
			messages.add(message);
			Gson gson = new Gson();
			String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
			out.println(result);
			out.close();
			return;
		}
		else{
			
			String check = checkUser(username);
			String check2 = checkNick(nickname);
			if(check2 == "FOUND"){
				message = "REGISTRATION_FAILED_USED_NICKNAME";
				messages.add(message);
				Gson gson = new Gson();
				String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
				out.println(result);
				out.close();
			}else{
			if(check == "NOT_FOUND"){
				String insert = insertUser(username, password, nickname, imgUrl, description);
				if(insert == "REGISTRATION_SUCCESS"){
					
					
					HttpSession session = request.getSession();
					session.setAttribute("username", username);
					
					message = "REGISTRATION_SUCCESS";
					messages.add(message);
					Gson gson = new Gson();
					String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
					out.println(result);
					out.close();
					
				}else if(insert == "REGISTRATION_FAIL"){
					
					message = "REGISTRATION_FAIL";
					messages.add(message);
					Gson gson = new Gson();
					String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
					out.println(result);
					out.close();
					
				}
			}
			else if(check == "FOUND"){
				
				message = "REGISTRATION_FAIL_USER_FOUND";
				messages.add(message);
				Gson gson = new Gson();
				String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
				out.println(result);
				out.close();
				
			}else if (check == "REGISTRATION_FAIL"){
				
				message = "REGISTRATION_FAIL";
				messages.add(message);
				Gson gson = new Gson();
				String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
				out.println(result);
				out.close();
				
			}else{
				
				message = "REGISTRATIPN_FAIL";
				messages.add(message);
				Gson gson = new Gson();
				String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
				out.println(result);
				out.close();
				
				
			}
			}
			
		}
		
		
	}
	
	/**
	 * check if the user is in the DB
	 * @param username the user username
	 * @return FOUND NOT_FOUND REGISTRATION_FAIL
	 */
	public String checkUser(String username){
	
		try{
		
			Context context = new InitialContext();
			BasicDataSource ds = (BasicDataSource)context.lookup(
					getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
			Connection conn = ds.getConnection();

			PreparedStatement stmt;
			try {
				stmt = conn.prepareStatement(AppConstants.SELECT_USER_BY_NAME_STMT);
				
				stmt.setString(1, username);
				ResultSet rs = stmt.executeQuery();
				
				if (rs.next()){
					rs.close();
					stmt.close();
					conn.close();
					return "FOUND";
				}
				else{
					
					rs.close();
					stmt.close();
					conn.close();
				
					return "NOT_FOUND";
				
				}
				
			} catch (SQLException e){
				getServletContext().log("Error while querying for users", e);
	    		
				//return "AYMAN";
				
				return "REGISTRATION_FAIL";
			}
		
		}catch (SQLException | NamingException e) {
    		getServletContext().log("Error while closing connection", e);
    		
    		//return "AYMAN";
    	
    		return "REGISTRATION_FAIL";//internal server error
    	}
		
	}
	
	
	/**
	 * check if the user nickname is in the DB
	 * @param nickname the user nickname
	 * @return FOUND NOT_FOUND REGISTRATION_FAIL
	 */
	public String checkNick(String nickname){
		
		try{
		
			Context context = new InitialContext();
			BasicDataSource ds = (BasicDataSource)context.lookup(
					getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
			Connection conn = ds.getConnection();

			PreparedStatement stmt;
			try {
				stmt = conn.prepareStatement(AppConstants.SELECT_USER_BY_NICKNAME_STMT);
				
				stmt.setString(1, nickname);
				ResultSet rs = stmt.executeQuery();
				
				if (rs.next()){
					rs.close();
					stmt.close();
					conn.close();
					return "FOUND";
				}
				else{
					
					rs.close();
					stmt.close();
					conn.close();
				
					return "NOT_FOUND";
				
				}
				
			} catch (SQLException e){
				getServletContext().log("Error while querying for users", e);
	    		
				//return "AYMAN";
				
				return "REGISTRATION_FAIL";
			}
		
		}catch (SQLException | NamingException e) {
    		getServletContext().log("Error while closing connection", e);
    		
    		//return "AYMAN";
    	
    		return "REGISTRATION_FAIL";//internal server error
    	}
		
	}
	
	
	
	/**
	 * Inserts a user to database
	 * @param username the user username
	 * @param password the user password
	 * @param nickname the user nickname
	 * @param imgUrl the user image URL
	 * @param description the user description
	 * @return REGISTRATION_SUCCESS or REGISTRATION_FAIL
	 */
	public String insertUser(String username, String password, String nickname, String imgUrl, String description){
		
		try{
			
			Context context = new InitialContext();
			BasicDataSource ds = (BasicDataSource)context.lookup(
					getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
			Connection conn = ds.getConnection();

			PreparedStatement stmt;
			try {
				stmt = conn.prepareStatement(AppConstants.INSERT_USER_STMT);
				
				if(imgUrl == "" || imgUrl == null){
					imgUrl = "https://s-media-cache-ak0.pinimg.com/originals/d3/69/d9/d369d9056795f553e244da66e8297cca.png";
				}
				if(description =="" || description == null){
					description = "Description unavailable";
				}
				
				stmt.setString(1, username);
				stmt.setString(2, password);
				stmt.setString(3, nickname);
				stmt.setString(4, imgUrl);
				stmt.setString(5, description);
				
				
				stmt.executeUpdate();
				
				
				stmt.close();
				conn.close();
				
				return "REGISTRATION_SUCCESS";
				
			} catch (SQLException e) {
				getServletContext().log("Error while querying for customers", e);
				conn.close();
				
				//return "AYMAN";
				
				return "REGISTRATION_FAIL";
			}

		}catch (SQLException | NamingException e) {
    		getServletContext().log("Error while closing connection", e);
    		
    		//return "AYMAN";
    		
    		return "REGISTRATION_FAIL";//internal server error
    	}
		
	}
	
}



