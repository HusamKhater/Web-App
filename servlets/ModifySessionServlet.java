package example.servlets;


import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

/**
 * Servlet return if the user is in the session or not
 */
@WebServlet("/ModifySessionServlet")
public class ModifySessionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ModifySessionServlet() {
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
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 * @return return if the user is in the session or not
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		
		PrintWriter out = response.getWriter();
		Collection<String> messages = new ArrayList<String>();
		String message = "NOT_FOUND";
		
		HttpSession session = request.getSession();
		
		String nickname = (String) session.getAttribute("username");
		if(nickname != null){
			message = nickname;
		}
		
		messages.add(message);
		Gson gson = new Gson();
		String result = gson.toJson(messages, new TypeToken<Collection<String>>(){}.getType());
		out.println(result);
		
		
	}

}
