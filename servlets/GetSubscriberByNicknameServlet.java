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
 * Servlet that takes as parameter the channel name and the user nickname, check wether the given 
 * 	data exist in the subscriber table or not
 */
@WebServlet("/GetSubscriberByNicknameServlet")
public class GetSubscriberByNicknameServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetSubscriberByNicknameServlet() {
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
	 * @see servlet that check wether the given channel name and nickname exist in the subscribers table
	 * @return json format string message indicate wether the given data exist in the subscribers table(FOUND, NOT_FOUND)
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
		Collection<String> messages = new ArrayList<String>();
		String message = null;

		String userNickname = joUser.get("userNickname").getAsString();
		String channelName= joUser.get("channelName").getAsString();

		try {

			Context context = new InitialContext();
			BasicDataSource ds = (BasicDataSource) context
					.lookup(getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
			Connection conn = ds.getConnection();

			PreparedStatement stmt;


			try {
				stmt = conn.prepareStatement(AppConstants.SELECT_SUBSCRIBED_BY_NICKNAME_AND_CHANNELNAME_STMT);

				stmt.setString(1, userNickname);
				stmt.setString(2,channelName);
				ResultSet rs = stmt.executeQuery();
				
				if (rs.next()){
					
					message = "FOUND";
					messages.add(message);
					Gson gson = new Gson();
					String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
					out.println(result);
					
				}else{
					message = "NOT_FOUND";
					messages.add(message);
					Gson gson = new Gson();
					String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
					out.println(result);
				}
				
				if(rs != null)
					rs.close();
				stmt.close();
			} catch (SQLException e) {
				getServletContext().log("Error while querying for users", e);
			}
			
			
			conn.close();

		} catch (SQLException | NamingException e) {
			getServletContext().log("Error while closing connection", e);
		}
		
		out.close();
	}

}
