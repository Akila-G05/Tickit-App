package com.tickit.model;


import com.tickit.entity.Task;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class TaskServlet extends HttpServlet {
    private static SessionFactory factory;

    @Override
    public void init() throws ServletException {
        try {
            factory = new Configuration().configure("hibernate.cfg.xml").buildSessionFactory();
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServletException("Hibernate Error!");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        setCorsHeaders(resp);

        String search = req.getParameter("search");
        String idParam = req.getParameter("id");

        try (Session session = factory.openSession()) {

            List<Task> tasks;

            // 🔹 1️⃣ If ID is provided → fetch by ID
            if (idParam != null && !idParam.trim().isEmpty()) {

                Long id = Long.parseLong(idParam);

                tasks = session.createQuery(
                                "from Task where id = :id",
                                Task.class)
                        .setParameter("id", id)
                        .list();

            }
            // 🔹 2️⃣ Else if search provided → search
            else if (search != null && !search.trim().isEmpty()) {

                tasks = session.createQuery(
                                "from Task where lower(title) like :search or lower(description) like :search",
                                Task.class)
                        .setParameter("search", "%" + search.toLowerCase() + "%")
                        .list();

            }
            // 🔹 3️⃣ Else → load all
            else {
                tasks = session.createQuery("from Task", Task.class).list();
            }

            JSONArray jsonArray = new JSONArray();

            for (Task t : tasks) {
                JSONObject obj = new JSONObject();
                obj.put("id", t.getId());
                obj.put("title", t.getTitle());
                obj.put("description", t.getDescription());
                obj.put("created_date", t.getCreatedDate());
                jsonArray.put(obj);
            }

            resp.setContentType("application/json");
            resp.getWriter().write(jsonArray.toString());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        String jsonString = req.getReader().lines().collect(Collectors.joining());
        JSONObject jsonObject = new JSONObject(jsonString);

        try (Session session = factory.openSession()) {
            Transaction tx = session.beginTransaction();
            Task task = new Task(
                    jsonObject.getString("title"),
                    jsonObject.getString("description"),
                    jsonObject.getString("created_date")
            );
            session.persist(task);
            tx.commit();
        }
        sendResponse(resp, "Task Saved Successfully");
    }


    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        String jsonString = req.getReader().lines().collect(Collectors.joining());
        JSONObject jsonObject = new JSONObject(jsonString);
        int id = jsonObject.getInt("id");

        try (Session session = factory.openSession()) {
            Transaction tx = session.beginTransaction();
            Task task = session.get(Task.class, id);

            if (task != null) {
                task.setTitle(jsonObject.getString("title"));
                task.setDescription(jsonObject.getString("description"));
                session.merge(task);
                tx.commit();
                sendResponse(resp, "Task Updated Successfully");
            } else {
                resp.setStatus(404);
                sendResponse(resp, "Task Not Found");
            }
        }
    }


    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);


        String idParam = req.getParameter("id");

        if (idParam != null) {
            int id = Integer.parseInt(idParam);
            try (Session session = factory.openSession()) {
                Transaction tx = session.beginTransaction();
                Task task = session.get(Task.class, id);

                if (task != null) {
                    session.remove(task);
                    tx.commit();
                    sendResponse(resp, "Task Deleted Successfully");
                } else {
                    resp.setStatus(404);
                    sendResponse(resp, "Task Not Found");
                }
            }
        } else {
            resp.setStatus(400);
            sendResponse(resp, "ID is required");
        }
    }


    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    private void sendResponse(HttpServletResponse resp, String message) throws IOException {
        resp.setContentType("application/json");
        resp.getWriter().write("{\"message\": \"" + message + "\"}");
    }
}
