package com.example.workflow.controllers;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.history.HistoricActivityInstance;
import org.camunda.bpm.engine.history.HistoricDetail;
import org.camunda.bpm.engine.history.HistoricProcessInstance;
import org.camunda.bpm.engine.history.HistoricTaskInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import spinjar.com.minidev.json.JSONArray;
import spinjar.com.minidev.json.parser.JSONParser;
import spinjar.com.minidev.json.parser.ParseException;

import java.io.FileNotFoundException;
import java.io.FileReader;
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
            List<HistoricDetail> details = historyService.createHistoricDetailQuery().processInstanceId(process.getId()).orderByTime().asc().list();
            process_variables.add(details);
        }
        return process_variables;
    }
    @GetMapping("/running/activities/details")
    public List<List<HistoricDetail>> getActivityDetails() {
        List<List<HistoricDetail>> activity_variables = new ArrayList<>();
        List<HistoricActivityInstance> activities = historyService.createHistoricActivityInstanceQuery().unfinished().orderByHistoricActivityInstanceStartTime().asc().list();
        for (HistoricActivityInstance activity : activities) {
            List<HistoricDetail> details = historyService.createHistoricDetailQuery().activityInstanceId(activity.getId()).orderByTime().asc().list();
            activity_variables.add(details);
        }
        return activity_variables;
    }
    @GetMapping("/processes")
    public List<HistoricProcessInstance> getProcessInstances() {
        return historyService.createHistoricProcessInstanceQuery().list();
    }
    @GetMapping("/activities")
    public List<HistoricActivityInstance> getActivityInstances() {
        return historyService.createHistoricActivityInstanceQuery().list();
    }
    @GetMapping("/running/activities")
    public List<HistoricActivityInstance> getRunningActivityInstances() {
        return historyService.createHistoricActivityInstanceQuery().unfinished().orderByHistoricActivityInstanceStartTime().asc().list();
    }

    @GetMapping("/tasks")
    public List<HistoricTaskInstance> getTaskInstances() {
        return historyService.createHistoricTaskInstanceQuery().list();
    }
    @GetMapping("/tasks/running")
    public List<HistoricTaskInstance> getRunningTaskInstances() {
        return historyService.createHistoricTaskInstanceQuery().unfinished().list();
    }
    /*
    @GetMapping("/test")
    public List<String> getTest() {
        List<HistoricProcessInstance> x;
        x = historyService.createHistoricProcessInstanceQuery().list();
        List<String> y = new ArrayList<>();
        x.forEach(c -> y.add(c.getId()));
        return y;
    }
    */
    @GetMapping("/projects")
    public JSONArray getProjects() throws FileNotFoundException, ParseException {
        JSONParser parser = new JSONParser();
        JSONArray projects = (JSONArray) parser.parse(new FileReader("src/main/resources/data/projects.json"));
        return projects;
    }
    @GetMapping("/employees")
    public JSONArray getEmployees() throws FileNotFoundException, ParseException {
        JSONParser parser = new JSONParser();
        JSONArray employees = (JSONArray) parser.parse(new FileReader("src/main/resources/data/employees.json"));
        return employees;
    }
}
