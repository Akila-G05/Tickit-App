package com.tickit;

import com.tickit.model.TaskServlet;
import org.apache.catalina.Context;
import org.apache.catalina.startup.Tomcat;

import java.io.File;

public class Main {
    public static void main(String[] args) throws Exception {
        Tomcat tomcat = new Tomcat();
        tomcat.setPort(8080);
        tomcat.getConnector();

        Context ctx = tomcat.addContext("", new File(".").getAbsolutePath());
        Tomcat.addServlet(ctx, "TaskServlet", new TaskServlet());
        ctx.addServletMappingDecoded("/tasks", "TaskServlet");

        tomcat.start();
        System.out.println("Tickit Server Started on Port 8080...");
        tomcat.getServer().await();
    }
}
