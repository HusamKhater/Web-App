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


/**
 * Servlet that takes as parameter the private channel name,
 * 	check wether there is a private channel with the given name or not
 */
@WebServlet("/GetPrivateChannelByNameServlet")
public class GetPrivateChannelByNameServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetPrivateChannelByNameServlet() {
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
	 * @see servlet that check wether the given private channel name is already exist or not
	 * @return json format string message indicate whether the given private channel name exist or no( FOUND, NOT_FOUND)
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

		String privateChannelName = joUser.get("privateChannelName").getAsString();
		
		Collection<String> result = new ArrayList<String>(); 

		try {

			Context context = new InitialContext();
			BasicDataSource ds = (BasicDataSource) context
					.lookup(getServletContext().getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
			Connection conn = ds.getConnection();

			PreparedStatement stmt;


			try {
				stmt = conn.prepareStatement(AppConstants.SELECT_PRIVATE_CHANNEL_STMT);

				stmt.setString(1, privateChannelName);
				ResultSet rs = stmt.executeQuery();
				
				
				if (rs.next()){
					result.add("FOUND");
				}else{
					result.add("NOT_FOUND");
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
        	String subscribersJsonResult = gson.toJson(result, AppConstants.STRING_COLLECTION);

        	PrintWriter writer = response.getWriter();
        	writer.println(subscribersJsonResult);
        	writer.close();
			
		} catch (SQLException | NamingException e) {
			getServletContext().log("Error while closing connection", e);
			
		}
		
		out.close();

	}

}
