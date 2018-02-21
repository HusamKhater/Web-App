package example;

import java.io.IOException;
import java.util.Collections;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import example.model.User;

/**
 * 
 * Server-side WebSocket that managed a messages transmitting between all the Users end-points 
 *
 * @author Husam&Ayman
 *
 */
@ServerEndpoint("/{username}")
public class ChatEndPoint{
	
	//tracks all active Users in the App.
    private static Map<Session,User> chatUsers = Collections.synchronizedMap(new HashMap<Session,User>()); 
    
    /**
     * Joins a new client to the chat
     * @param session client end point session
     * @param username the user's name of the user how insert the session
     * @throws IOException
     */
    @OnOpen
    public void joinChat(Session session, @PathParam("username") String username) throws IOException{
    	if (session.isOpen()) {
			
    		// insert a user to the session
			chatUsers.put(session,new User(username,"","","",""));
		
		}
    }

    /**
     * Message delivery between chat participants
     * @param session client end point session
     * @param msg the channel name that we have a sendmessage function  from it		
     * @throws IOException
     */
    @OnMessage
    public void deliverChatMessege(Session session, String msg) throws IOException{
        try {
            if (session.isOpen()) {
               //deliver message from another user so we have tell all the users how are connecting to the App that there are a message from user 
               User user = chatUsers.get(session);
               doNotify(user.getUsername(), msg, null);
            }
        } catch (IOException e) {
                session.close();
        }
    }
    
    /**
     * 
     * We used this method when we have an error from the web socket, it's useful on refreshing the page
     * 
     * @param session session client end point session
     * @param ex a thrown exception 
     */
    @OnError
    public void onError(Session session,Throwable ex){
    
    }
    
    
    /**
     * Removes a User from the session of the web socket
     * @param session client end point session
     * @throws IOException
     */
    @OnClose
    public void leaveChat(Session session) throws IOException{
    	
    		chatUsers.remove(session);//fake user just for removal
    }

    /*
     * Helper method for message delivery to chat participants. skip parameter is used to avoid delivering a message 
     * to a certain client (e.g., one that has just left) 
     */
    /**
     * 
     * @param author how send the message 
     * @param message the message that has been sent
     * @param skip session client end point session
     * @throws IOException
     */
    private void doNotify(String author, String message, Session skip) throws IOException{
    	
    	// for each User in the session, we should till him that he have a message
    	for (Entry<Session,User> user : chatUsers.entrySet()){
    		Session session = user.getKey();
    		if (!session.equals(skip) && session.isOpen()){
    			session.getBasicRemote().sendText(message);
    		}
    	}
    }


}
