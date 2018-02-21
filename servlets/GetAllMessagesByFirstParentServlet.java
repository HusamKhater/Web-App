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

import example.AppConstants;
import example.model.Message;

/**
 * Servlet that returns all the messages that have the given parent id
 * we use it when we have to show the replies of message
 */
@WebServlet("/GetAllMessagesByFirstParentServlet")
public class GetAllMessagesByFirstParentServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetAllMessagesByFirstParentServlet() {
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
	 * @see servlet that takes as a parameter a message's id
	 * @return json format collection of messages that have the same parent id field
	 * @throws ServletException, IOException
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	

		StringBuffer sb = new StringBuffer();
		try {
			BufferedReader reader = request.getReader();
			String line = null;
			while ((line = reader.readLine()) != null) {
				sb.append(line);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		JsonParser parser = new JsonParser();
		JsonObject joUser = null;
		joUser = (JsonObject) parser.parse(sb.toString());


		PrintWriter out = response.getWriter();
		


		Collection<Message> messagesResult = new ArrayList<Message>(); 
		
		int firstParent= joUser.get("parent").getAsInt();

		try {

			Context context = new InitialContext();
			BasicDataSource ds = (BasicDataSource) context
					.lookup(getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
			Connection conn = ds.getConnection();

			PreparedStatement stmt;


			try {
				stmt = conn.prepareStatement(AppConstants.SELECT_MESSAGES_BY_PARENT_STMT);

				stmt.setInt(1,firstParent);
				ResultSet rs = stmt.executeQuery();
				
				while (rs.next()){
					messagesResult.add(new Message(rs.getString(1),rs.getString(2),rs.getString(3),rs.getInt(4),rs.getInt(5),rs.getInt(5),rs.getTimestamp(7),rs.getTimestamp(8),rs.getString(9)));
				}
				
				if(rs != null)
					rs.close();
				stmt.close();
			} catch (SQLException e) {
				getServletContext().log("Error while querying for users", e);
			}
			
			conn.close();

			Gson gson = new Gson();
        	//convert from customers collection to json
        	String messagesJsonResult = gson.toJson(messagesResult, AppConstants.SUBSCRIBER_COLLECTION);

        	PrintWriter writer = response.getWriter();
        	writer.println(messagesJsonResult);
        	writer.close();
			
		} catch (SQLException | NamingException e) {
			getServletContext().log("Error while closing connection", e);
		}
		
		out.close();		

	
	
	}

}
