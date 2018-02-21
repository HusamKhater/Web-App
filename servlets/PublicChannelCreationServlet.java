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

import org.apache.tomcat.dbcp.dbcp.BasicDataSource;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import example.AppConstants;

/**
 * Servlet insert a public channel to the DB
 */
@WebServlet("/PublicChannelCreationServlet")
public class PublicChannelCreationServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PublicChannelCreationServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 * @see servlet that insert a public channel to the public channels table
	 * @return json format string message indicate whether the adding success or not(CREATION_SUCCESS, CREATION_FAIL)
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
		
	
		if(joUser.get("publicChannelName")==null || joUser.get("publicChannelDescription")==null){
	    	
	    	message = "CREATION_FAIL_MISS_REQUIERD_FIELD";
			messages.add(message);
			Gson gson = new Gson();
			String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
			out.println(result);
			out.close();
			
			return ;
	    	
	    }
		
	
		String publicChannelName = joUser.get("publicChannelName").getAsString();
		String publicChannelDescription = joUser.get("publicChannelDescription").getAsString();
		
		if(publicChannelName==null ||  publicChannelDescription==null){
			
			message = "CREATION_FAILED";
			messages.add(message);
			Gson gson = new Gson();
			String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
			out.println(result);
			out.close();
		}
		
		if(publicChannelName=="" ||  publicChannelDescription==""  || publicChannelName.trim().isEmpty() ||  publicChannelDescription.trim().isEmpty()){
			
			message = "CTEATION_FAILED_YOU_MUST_WRITE_SOMETHING";
			messages.add(message);
			Gson gson = new Gson();
			String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
			out.println(result);
			out.close();
			return;
		}
		
		String res = checkChannel(publicChannelName);
		
		if(res == "FOUND"){
				
			message = "CREATION_FAIL_CHANNEL_NAME_FOUND";
			messages.add(message);
			Gson gson = new Gson();
			String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
			out.println(result);
			out.close();
			
		}else{
			if(res == "NOT_FOUND"){
				
				String insert = insertChannel(publicChannelName, publicChannelDescription,1);
				if(insert == "CREATION_SUCCESS"){
					
					message = "CREATION_SUCCESS";
					messages.add(message);
					Gson gson = new Gson();
					String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
					out.println(result);
					out.close();
					
				}else if(insert == "CREATION_FAIL"){
					
					message = "CREATION_FAIL";
					messages.add(message);
					Gson gson = new Gson();
					String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
					out.println(result);
					out.close();
					
				}
				
				
			}else{
				if (res == "CREATION_FAIL"){
					
					message = "CREATION_FAIL";
					messages.add(message);
					Gson gson = new Gson();
					String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
					out.println(result);
					out.close();
					
				}else{
					
					message = "CREATION_FAIL";
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
	 * 	function that check wether the channel name is already used or not
	 * @param name	public channel name
	 * @return	FOUND, NOT_FOUND, CREATION_FAIL according to the situation
	 */
	private String checkChannel(String name){
		
		try{
			
			Context context = new InitialContext();
			BasicDataSource ds = (BasicDataSource)context.lookup(
					getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
			Connection conn = ds.getConnection();

			PreparedStatement stmt;
			try {
				stmt = conn.prepareStatement(AppConstants.SELECT_PUBLIC_CHANNELS_BY_CHANNELNAME_STMT);
				
				stmt.setString(1, name);
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
				
				return "CREATION_FAIL";
			}
		
		}catch (SQLException | NamingException e) {
    		getServletContext().log("Error while closing connection", e);
    		
    		//return "AYMAN";
    	
    		return "CREATION_FAIL";//internal server error

		}
		
		
	}
		
		
		

	/**
	 * Inserts a channel to database
	 * @param channelName
	 * @param channelDescription
	 * @return creation_SUCCESS or creation_FAIL
	 */
	public String insertChannel(String channelName, String channelDescription, int n){
		
		try{
			
			Context context = new InitialContext();
			BasicDataSource ds = (BasicDataSource)context.lookup(
					getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
			Connection conn = ds.getConnection();

			PreparedStatement stmt;
			try {
				stmt = conn.prepareStatement(AppConstants.INSERT_PUBLIC_CHANNEL_STMT);
				
				
				
				stmt.setString(1, channelName);
				stmt.setString(2, channelDescription);
				stmt.setInt(3, n);
				
				
				stmt.executeUpdate();
				
				
				stmt.close();
				conn.close();
				
				return "CREATION_SUCCESS";
				
			} catch (SQLException e) {
				getServletContext().log("Error while querying for customers", e);
				conn.close();
				
				return "CREATION_FAIL";
			}

		}catch (SQLException | NamingException e) {
    		getServletContext().log("Error while closing connection", e);
    		
    		
    		return "CREATION_FAIL";//internal server error
    	}
		
	}






}

