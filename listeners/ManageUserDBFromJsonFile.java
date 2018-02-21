package example.listeners;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.tomcat.dbcp.dbcp.BasicDataSource;


import example.AppConstants;



/**
 * 
 * 	listener that insert all the tables to the derby data base,
 * 	it insert the users table, public channel table, subscribers table, messages table, private channels table
 * 
 * @author Ayman&Husam
 *
 */
@WebListener
public class ManageUserDBFromJsonFile implements ServletContextListener  {
	

	/**
	 * Default constructor 
	 */
	public  ManageUserDBFromJsonFile(){
		
	}
	
	/**
	 * 	Function that check whether the table is already exist in the data base
	 * @param e	the exception that get it 
	 * @return	true if the table exist in the DB, false if the exception is another type 
	 */
	private boolean tableAlreadyExists(SQLException e) {
        boolean exists;
        if(e.getSQLState().equals("X0Y32")) {
            exists = true;
        } else {
            exists = false;
        }
        return exists;
    }
	
	/**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent event)  { 
    	ServletContext cntx = event.getServletContext();
    	
    	try{
    		//
    		//system.out.println("%%%%%%%%%%%%%%% TRY CONNECT TO DATABASE %%%%%%%%%%%%%%%");
    		//obtain UserDB data source from Tomcat's context
    		Context context = new InitialContext();
    		BasicDataSource ds = (BasicDataSource)context.lookup(
    				cntx.getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.OPEN);
    		
    		
    		Connection conn = ds.getConnection();
    		
    		boolean created = false;
    		try{
    			
    			//system.out.println("%%%%%%%%%%%%%%% THERE IS CONNECTION TO USERS %%%%%%%%%%%%%%%");
    			
    			//create Users table
    			Statement stmt = conn.createStatement();
    			stmt.executeUpdate(AppConstants.CREATE_USERS_TABLE);
    			//commit update
        		conn.commit();
        		stmt.close();
    		
    		}catch (SQLException e){
    			//check if exception thrown since table was already created (so we created the database already 
    			//in the past
    			//system.out.println("%%%%%%%%%%%%%%% CHECK EXISTS OR SOMETHING WRONG %%%%%%%%%%%%%%%");
    			created = tableAlreadyExists(e);
    			if (!created){
    				throw e;//re-throw the exception so it will be caught in the
    				//external try..catch and recorded as error in the log
    			}
    		}
    		
    		
       		conn.close();


    		// now we will create the public channels table
    		conn = ds.getConnection();
    		
    		boolean created1 = false;
    		try{
    			
    			//system.out.println("@@@@@@@@@@@@@@@@@@@ THERE IS CONNECTION TO PUBLIC CHANNELS @@@@@@@@@@@@@");
    			
    			//create Public channels table
    			Statement stmt = conn.createStatement();
    			stmt.executeUpdate(AppConstants.CREATE_PUBLIC_CHANNELS_TABLE);
    			//commit update
        		conn.commit();
        		stmt.close();
    		
    		}catch (SQLException e){
    			//check if exception thrown since table was already created (so we created the database already 
    			//in the past
    			//system.out.println("@@@@@@@@@@@@@@@@@ CHECK EXISTS OR SOMETHING WRONG @@@@@@@@@@@@@@@@@@@");
    			created1 = tableAlreadyExists(e);
    			if (!created1){
    				throw e;//re-throw the exception so it will be caught in the
    				//external try..catch and recorded as error in the log
    			}
    		}
	

   		conn.close();

   		
   		// now we will create the Subscribers table
		conn = ds.getConnection();
		
		boolean created2 = false;
		try{
			
			//system.out.println("@@@@@@@@@@@@@@@@@@@ THERE IS CONNECTION TO SUBSCRIBERS TABLE @@@@@@@@@@@@@");
			
			//create Subscribers table
			Statement stmt = conn.createStatement();
			stmt.executeUpdate(AppConstants.CREATE_SUBSCRIBERS_TABLE);
			//commit update
    		conn.commit();
    		stmt.close();
		
		}catch (SQLException e){
			//check if exception thrown since table was already created (so we created the database already 
			//in the past
			//system.out.println("@@@@@@@@@@@@@@@@@ CHECK EXISTS OR SOMETHING WRONG @@@@@@@@@@@@@@@@@@@");
			created2 = tableAlreadyExists(e);
			if (!created2){
				throw e;//re-throw the exception so it will be caught in the
				//external try..catch and recorded as error in the log
			}
		}


		conn.close();
		
		
   		// now we will create the Messages table
		conn = ds.getConnection();
		boolean created3 = false;
		try{
			
			//system.out.println("@@@@@@@@@@@@@@@@@@@ THERE IS CONNECTION TO MESSAGES TABLE @@@@@@@@@@@@@");
			
			//create Messages table
			Statement stmt = conn.createStatement();
			stmt.executeUpdate(AppConstants.CREATE_MESSAGES_TABLE);
			//commit update
    		conn.commit();
    		stmt.close();
		
		}catch (SQLException e){
			//check if exception thrown since table was already created (so we created the database already 
			//in the past
			//system.out.println("@@@@@@@@@@@@@@@@@ CHECK EXISTS OR SOMETHING WRONG @@@@@@@@@@@@@@@@@@@");
			created3 = tableAlreadyExists(e);
			if (!created3){
				throw e;//re-throw the exception so it will be caught in the
				//external try..catch and recorded as error in the log
			}
		}


		conn.close();

		

		// now we will create the private channels table
		conn = ds.getConnection();
		
		boolean created4 = false;
		try{
			
			//system.out.println("@@@@@@@@@@@@@@@@@@@ THERE IS CONNECTION TO PRIVATE CHANNELS @@@@@@@@@@@@@");
			
			//create Private channels table
			Statement stmt = conn.createStatement();
			stmt.executeUpdate(AppConstants.CREATE_PRIVATE_CAHNNELS_TABLE);
			//commit update
    		conn.commit();
    		stmt.close();
		
		}catch (SQLException e){
			//check if exception thrown since table was already created (so we created the database already 
			//in the past
			//system.out.println("@@@@@@@@@@@@@@@@@ CHECK EXISTS OR SOMETHING WRONG @@@@@@@@@@@@@@@@@@@");
			created4 = tableAlreadyExists(e);
			if (!created4){
				throw e;//re-throw the exception so it will be caught in the
				//external try..catch and recorded as error in the log
			}
		}


		conn.close();

   		
    	} catch ( SQLException | NamingException e) {
    		//log error 
    		cntx.log("Error during database initialization",e);
    	}
    }
	
	
	
	/**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent event)  { 
   	 ServletContext cntx = event.getServletContext();
   	 
        //shut down database
   	 try {
   		 	//system.out.println("%%%%%%%%%%%%%%% CHECK DESTROY %%%%%%%%%%%%%%%");
    		//obtain CustomerDB data source from Tomcat's context and shutdown
    		Context context = new InitialContext();
    		BasicDataSource ds = (BasicDataSource)context.lookup(
    				cntx.getInitParameter(AppConstants.DB_DATASOURCE) + AppConstants.SHUTDOWN);
    		ds.getConnection();
    		ds = null;
		} catch (SQLException | NamingException e) {
			cntx.log("Error shutting down database",e);
		}

   }
    
    

}
