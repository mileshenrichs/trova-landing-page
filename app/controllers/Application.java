package controllers;

import com.ecwid.maleorang.MailchimpClient;
import com.ecwid.maleorang.MailchimpException;
import com.ecwid.maleorang.MailchimpObject;
import com.ecwid.maleorang.method.v3_0.lists.members.EditMemberMethod;
import com.ecwid.maleorang.method.v3_0.lists.members.MemberInfo;
import org.json.JSONObject;
import play.*;
import play.mvc.*;

import java.io.IOException;
import java.util.*;

import models.*;

public class Application extends Controller {

    public static void index() {
        render();
    }

    public static void feed() {
        render();
    }

    public static void addToList(String name, String email) {
        String firstName = "";
        String lastName = "";
        if(name.contains(" ")) {
            firstName = name.substring(0, name.indexOf(" ")).trim();
            lastName = name.substring(name.indexOf(" ")).trim();
        } else {
            firstName = name;
        }

        MailchimpClient client = new MailchimpClient(Play.configuration.getProperty("mailchimp.apikey"));
        try {
            EditMemberMethod.CreateOrUpdate method = new EditMemberMethod.CreateOrUpdate(Play.configuration.getProperty("mailchimp.listid"), email);
            method.status = "subscribed";
            method.merge_fields = new MailchimpObject();
            method.merge_fields.mapping.put("FNAME", firstName);
            method.merge_fields.mapping.put("LNAME", lastName);

            client.execute(method);
            JSONObject jsonResponse = new JSONObject()
                    .put("success", true);
            renderJSON(jsonResponse.toString());
        } catch (MailchimpException e) {
            Logger.warn(String.format("MailchimpException with inputs: Name - %s  |  Email - %s \n%s", firstName, email, e.getMessage()));
            e.printStackTrace();
            String message = e.getMessage();
            String simpleMsg;
            if(message.contains("API Error (400)")) {
                simpleMsg = "email";
            } else {
                simpleMsg = "idk";
            }
            JSONObject jsonResponse = new JSONObject()
                    .put("success", false)
                    .put("why", simpleMsg);
            renderJSON(jsonResponse.toString());
        } catch (IOException e) {
            Logger.warn(String.format("IOException with inputs: Name - %s  |  Email - %s \n%s", firstName, email, e.getMessage()));
            e.printStackTrace();
            JSONObject jsonResponse = new JSONObject()
                    .put("success", false)
                    .put("why", "idk");
            renderJSON(jsonResponse.toString());
        } finally {
            try {
                client.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}