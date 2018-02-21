package example.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
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

import example.AppConstants;
import example.model.Subscriber;

/**
 * Servlet that return all the subscribers( pair of channel name and user nick name that sunscribe this channel)
 */
@WebServlet("/GetAllSubscribersServlet")
public class GetAllSubscribersServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetAllSubscribersServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 * 
	 * @return json format, subscriber collection that contain all the subscribers pair
	 * @throws ServletException, IOException
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

	
		try {
        	//obtain CustomerDB data source from Tomcat's context
    		Context context = new InitialContext();
    		BasicDataSource ds = (BasicDataSource)context.lookup(
    				getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
    		Connection conn = ds.getConnection();

    		Collection<Subscriber> subscribersResult = new ArrayList<Subscriber>(); 
    		String uri = request.getRequestURI();
    		if (uri.indexOf(AppConstants.NAME) != -1){//filter customer by specific name
    			String name = uri.substring(uri.indexOf(AppConstants.NAME) + AppConstants.NAME.length() + 1);
    			PreparedStatement stmt;
    			try {
    				stmt = conn.prepareStatement(AppConstants.SELECT_SUBSCRIBED_BY_NICKNAME_STMT);
    				name = name.replaceAll("\\%20", " ");
    				stmt.setString(1, name);
    				ResultSet rs = stmt.executeQuery();
    				while (rs.next()){
    					subscribersResult.add(new Subscriber(rs.getString(1),rs.getString(2),rs.getString(3)
    							,rs.getInt(4),rs.getInt(5),rs.getInt(6)));
    				}
    				rs.close();
    				stmt.close();
    			} catch (SQLException e) {
    				getServletContext().log("Error while querying for customers", e);
    	    		response.sendError(500);//internal server error
    			}
    		}else{
    			Statement stmt;
    			try {
    				stmt = conn.createStatement();
    				ResultSet rs = stmt.executeQuery(AppConstants.SELECT_ALL_SUBSCRIBERS_STMT);
    				while (rs.next()){
    					subscribersResult.add(new Subscriber(rs.getString(1),rs.getString(2),rs.getString(3)
    							,rs.getInt(4),rs.getInt(5),rs.getInt(6)));
    				}
    				rs.close();
    				stmt.close();
    			} catch (SQLException e) {
    				getServletContext().log("Error while querying for customers", e);
    	    		response.sendError(500);//internal server error
    			}

    		}

    		conn.close();
    		
    		Gson gson = new Gson();
        	//convert from customers collection to json
        	String subscribersJsonResult = gson.toJson(subscribersResult, AppConstants.SUBSCRIBER_COLLECTION);

        	PrintWriter writer = response.getWriter();
        	writer.println(subscribersJsonResult);
        	writer.close();
    	} catch (SQLException | NamingException e) {
    		getServletContext().log("Error while closing connection", e);
    		response.sendError(500);//internal server error
    	}

	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
