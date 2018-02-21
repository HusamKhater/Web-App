package example.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
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
 * Servlet that decrement the number of subscriber for each channel name
 * with the given name from the subscribers table
 */
@WebServlet("/DecNumberOfSubscribersInSubscribersTable")
public class DecNumberOfSubscribersInSubscribersTable extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DecNumberOfSubscribersInSubscribersTable() {
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
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 * @see servlet that decrement the number of sebscribers of the given channek name 
	 * from the subscribers table
	 * 
	 * @return indicator CHANGING_NUMBER_OF_SUBS_SUCCESS or CHANGING_NUMBER_OF_SUBS_FAIL
	 * @throws ServletException  IOException
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

		// TODO Auto-generated method stub

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
	    } catch (Exception e) {
	    	e.printStackTrace(); 
	    }
		    
	    JsonParser parser = new JsonParser();
	    JsonObject joUser = null;
	    joUser = (JsonObject) parser.parse(sb.toString());
		    
		            
		
	    PrintWriter out = response.getWriter();
		Collection<String> messages = new ArrayList<String>();
		String message = null;
	
		
		String channelName = joUser.get("channelName").getAsString();
		
		
		try {

			Context context = new InitialContext();
			BasicDataSource ds = (BasicDataSource) context
					.lookup(getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
			Connection conn = ds.getConnection();

			PreparedStatement stmt;

			try {
				stmt = conn.prepareStatement(AppConstants.DEC_SUB_TABLE_NUM_OF_SUBS_BY_CANNELNAME_STMT);

				stmt.setString(1, channelName);
			
				stmt.executeUpdate();
				
				
				stmt.close();
				conn.close();
				
				message = "CHANGING_NUMBER_OF_SUBS_SUCCESS";
				messages.add(message);
				Gson gson = new Gson();
				String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
				out.println(result);
				out.close();
				
			} catch (SQLException e) {
				getServletContext().log("Error while querying for users", e);

				message = "CHANGING_NUMBER_OF_SUBS_FAIL";
				messages.add(message);
				Gson gson = new Gson();
				String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
				out.println(result);
				out.close();
			}
			
			
			conn.close();

			
			
		} catch (SQLException | NamingException e) {
			getServletContext().log("Error while closing connection", e);

			message = "CHANGING_FAIL";
			messages.add(message);
			Gson gson = new Gson();
			String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
			out.println(result);
			out.close();
		}

	
	
	}

}
