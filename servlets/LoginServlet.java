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
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;


import example.AppConstants;

/**
 * Servlet that takes as parameter the username and password of the user, and check if it can log the user into the website or no
 */
@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
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
	 * @see servlet that takes username and password of user and check if it can log in to the website
	 * @return json format string message indicate whether the user can access to the website or no.
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
		
	
		if(joUser.get("userL")==null || joUser.get("passL")==null){
	    	
	    	message = "LOGIN_FAIL_MISS_REQUIERD_FIELD";
			messages.add(message);
			Gson gson = new Gson();
			String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
			out.println(result);
			out.close();
			
			return ;
	    	
	    }
		
		
	
		String userL = joUser.get("userL").getAsString();
		String passL = joUser.get("passL").getAsString();
		
		
	
	
		String ans = CheckUser(userL, passL);
		
		if( ans == "LOGIN_SUCCESS"){
			
			HttpSession session = request.getSession();
			session.setAttribute("username", userL);
			
			
			message = "LOGIN_SUCCESS";
			messages.add(message);
			Gson gson = new Gson();
			String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
			out.println(result);
			out.close();
			
		}else{
			if(ans == "WRONG_PASS"){
				message = "LOGIN_FAIL_WRONG_PASS";
				messages.add(message);
				Gson gson = new Gson();
				String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
				out.println(result);
				out.close();
			}else{
				if( ans == "USER_NOT_FOUND"){
					message = "LOGIN_FAIL_USER_NOT_FOUND";
					messages.add(message);
					Gson gson = new Gson();
					String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
					out.println(result);
					out.close();
				}else{
					message = "LOGIN_FAIL";
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
	 * 	function that check if the given data about the user is in the DB or not
	 * @param user	the user username
	 * @param pass	the user password
	 * @return	string message according to the given data( USER_NOT_FOUND, LOGIN_SUCCESS, LOGIN_FAIL, WRONG_PASS)
	 */
	private String CheckUser(String user, String pass){
		
		try{
			
			if(user == null || pass == null){
				return  "USER_NOT_FOUND";
			}
			
			Context context = new InitialContext();
			BasicDataSource ds = (BasicDataSource)context.lookup(
					getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
			Connection conn = ds.getConnection();

			PreparedStatement stmt;
			
			try {
				stmt = conn.prepareStatement(AppConstants.SELECT_USER_BY_NAME_STMT);
				
				stmt.setString(1, user);
				ResultSet rs = stmt.executeQuery();
				
				if (rs.next()){
					
					String userPass = rs.getString("Password");
					
					if(userPass.equals(pass)){
						if (rs != null)
							rs.close();
						stmt.close();
						conn.close();
						return "LOGIN_SUCCESS";
					}
					
					if( rs != null)
						rs.close();
					stmt.close();
					conn.close();
					return "WRONG_PASS";
				}
				else{
					
					if(rs != null)
						rs.close();
					stmt.close();
					conn.close();
				
					return "USER_NOT_FOUND";
				
				}
				
			} catch (SQLException e){
				getServletContext().log("Error while querying for users", e);
	    		
				
				return "LOGIN_FAIL";
			}
			
			
		}catch (SQLException | NamingException e) {
    		getServletContext().log("Error while closing connection", e);
    		
    	
    		return "LOGIN_FAIL";//internal server error
    	}
		
	}
	

}
