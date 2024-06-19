package com.example.workflow.controllers;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.history.HistoricActivityInstance;
import org.camunda.bpm.engine.history.HistoricDetail;
import org.camunda.bpm.engine.history.HistoricProcessInstance;
import org.camunda.bpm.engine.history.HistoricTaskInstance;
import org.camunda.bpm.model.bpmn.instance.Property;
import org.camunda.bpm.model.bpmn.instance.ServiceTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import spinjar.com.minidev.json.JSONArray;
import spinjar.com.minidev.json.JSONObject;
import spinjar.com.minidev.json.parser.JSONParser;
import spinjar.com.minidev.json.parser.ParseException;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RestController
public class HistoryController {

    @Autowired
    private HistoryService historyService;
    private ServiceTask serviceTask;

    @GetMapping("/completed-processes")
    public List<HistoricProcessInstance> getCompletedProcesses() {
        return historyService.createHistoricProcessInstanceQuery().finished().list();
    }
    @GetMapping("/completed-processes/details")
    public List<List<HistoricDetail>> getCompletedProcessesDetails() {
        List<List<HistoricDetail>> process_variables = new ArrayList<>();
        List<HistoricProcessInstance> processes = historyService.createHistoricProcessInstanceQuery().finished().orderByProcessInstanceEndTime().asc().list();
        for (HistoricProcessInstance process : processes) {
            List<HistoricDetail> details = historyService.createHistoricDetailQuery().processInstanceId(process.getId()).orderByVariableName().asc().list();
            process_variables.add(details);
        }
        return process_variables;
    }
    @GetMapping("/processes/details")
    public List<List<HistoricDetail>> getProcessesDetails() {
        List<List<HistoricDetail>> process_variables = new ArrayList<>();
        List<HistoricProcessInstance> processes = historyService.createHistoricProcessInstanceQuery().orderByProcessInstanceStartTime().asc().list();
        for (HistoricProcessInstance process : processes) {
            List<HistoricDetail> details = historyService.createHistoricDetailQuery().processInstanceId(process.getId()).orderByVariableName().asc().list();
            process_variables.add(details);
        }
        return process_variables;
    }
    @GetMapping("/processes")
    public List<HistoricProcessInstance> getProcessInstances() {
        return historyService.createHistoricProcessInstanceQuery().list();
    }
    @GetMapping("/activities")
    public List<HistoricActivityInstance> getActivityInstances() {
        return historyService.createHistoricActivityInstanceQuery().list();
    }
    @GetMapping("/activities/running")
    public List<HistoricActivityInstance> getRunningActivityInstances() {
        return historyService.createHistoricActivityInstanceQuery().unfinished().list();
    }

    @GetMapping("/tasks")
    public List<HistoricTaskInstance> getTaskInstances() {
        return historyService.createHistoricTaskInstanceQuery().list();
    }
    @GetMapping("/tasks/running")
    public List<HistoricTaskInstance> getRunningTaskInstances() {
        return historyService.createHistoricTaskInstanceQuery().unfinished().list();
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
        unused.put("id", "0");
        unused.put("hours", "300");
        unused.put("name", "unused hours");
        JSONObject project1 = new JSONObject();
        project1.put("id", "1");
        project1.put("hours", "100");
        project1.put("name", "Project 1");
        JSONObject project2 = new JSONObject();
        project2.put("id", "2");
        project2.put("hours", "120");
        project2.put("name", "Project 2");
        JSONObject project3 = new JSONObject();
        project3.put("id", "3");
        project3.put("hours", "80");
        project3.put("name", "Project 3");
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
