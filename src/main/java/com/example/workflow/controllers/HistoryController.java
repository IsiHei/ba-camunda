package com.example.workflow.controllers;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.history.HistoricActivityInstance;
import org.camunda.bpm.engine.history.HistoricProcessInstance;
import org.camunda.bpm.engine.history.HistoricTaskInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import spinjar.com.minidev.json.JSONArray;
import spinjar.com.minidev.json.JSONObject;
import spinjar.com.minidev.json.parser.JSONParser;
import spinjar.com.minidev.json.parser.ParseException;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

@RestController
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    @GetMapping("/completed-processes")
    public List<HistoricProcessInstance> getCompletedProcesses() {
        return historyService.createHistoricProcessInstanceQuery().finished().list();
    }
    @GetMapping("/processes")
    public List<HistoricProcessInstance> getProcessInstances() {
        return historyService.createHistoricProcessInstanceQuery().list();
    }
    @GetMapping("/activities")
    public List<HistoricActivityInstance> getActivityInstances() {
        //return historyService.createHistoricJobLogQuery().list();
        return historyService.createHistoricActivityInstanceQuery().list();
    }
    @GetMapping("/tasks")
    public List<HistoricTaskInstance> getTaskInstances() {
        return historyService.createHistoricTaskInstanceQuery().list();
    }
    @GetMapping("/test")
    public List<String> getTest() {
        List<HistoricProcessInstance> x;
        x = historyService.createHistoricProcessInstanceQuery().list();
        List<String> y = new ArrayList<>();
        x.forEach(c -> y.add(c.getId()));
        return y;
    }
    @GetMapping("/projects")
    public JSONArray getProjects() {
        JSONObject unused = new JSONObject();
        unused.put("Id", "0");
        unused.put("Hours", "300");
        unused.put("Name", "unused hours");
        JSONObject project1 = new JSONObject();
        project1.put("Id", "1");
        project1.put("Hours", "100");
        project1.put("Name", "Project 1");
        JSONObject project2 = new JSONObject();
        project2.put("Id", "2");
        project2.put("Hours", "120");
        project2.put("Name", "Project 2");
        JSONObject project3 = new JSONObject();
        project3.put("Id", "3");
        project3.put("Hours", "80");
        project3.put("Name", "Project 3");
        JSONArray projects = new JSONArray();
        projects.add(unused);
        projects.add(project1);
        projects.add(project2);
        projects.add(project3);
        return projects;
    }
    @GetMapping("/employees")
    public JSONArray getEmployees() throws FileNotFoundException, ParseException {
        JSONParser parser = new JSONParser();
        JSONArray employees = (JSONArray) parser.parse(new FileReader("src/main/resources/data/employees.json"));
        return employees;
    }
}
