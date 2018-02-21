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
import example.model.PublicChannel;

/**
 * Servlet that return all the public channel that we have
 */
@WebServlet("/GetAllPublicChannelsServlet")
public class GetAllPublicChannelsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetAllPublicChannelsServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 * 
	 * @return json format public channel collection that contain all the public channels
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

    		Collection<PublicChannel> publicChannelResult = new ArrayList<PublicChannel>(); 
    		String uri = request.getRequestURI();
    		if (uri.indexOf(AppConstants.NAME) != -1){//filter customer by specific name
    			String name = uri.substring(uri.indexOf(AppConstants.NAME) + AppConstants.NAME.length() + 1);
    			PreparedStatement stmt;
    			try {
    				stmt = conn.prepareStatement(AppConstants.SELECT_PUBLIC_CHANNELS_BY_CHANNELNAME_STMT);
    				name = name.replaceAll("\\%20", " ");
    				stmt.setString(1, name);
    				ResultSet rs = stmt.executeQuery();
    				while (rs.next()){
    					publicChannelResult.add(new PublicChannel(rs.getString(1),rs.getString(2),rs.getInt(3)));
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
    				ResultSet rs = stmt.executeQuery(AppConstants.SELECT_ALL_PUBLIC_CHANNELS_STMT);
    				while (rs.next()){
    					publicChannelResult.add(new PublicChannel(rs.getString(1),rs.getString(2),rs.getInt(3)));
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
        	String publicChannelJsonResult = gson.toJson(publicChannelResult, AppConstants.PUBLIC_CHANNEL_COLLECTION);

        	PrintWriter writer = response.getWriter();
        	writer.println(publicChannelJsonResult);
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
