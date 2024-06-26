export default {
    id: "contextTestID",
    pluginPoint: "cockpit.processInstance.runtime.tab",
    properties: {
        label: "Context"
    },
    render: async (node, {api, processInstanceId}) => {
        const activity = await getCurrentActivity(api, processInstanceId)
        const activityId = await activity.id
        // get Variables of Process
        const variables = await getProcessVariables(processInstanceId)
        let employeeName = await getEmployeeName(variables.employee)
        let startTime = new Date(variables.start_year, variables.start_month, variables.start_day);
        let endTime = new Date(variables.end_year, variables.end_month, variables.end_day)
        // Process: Vacation Request
        // Activity: Check request by Department Manager
        if (activityId === "check_dm") {
            const projects = await getProjects().valueOf();
            const project_names = []
            const project_hours = []
            for (const k in projects) {
                const project = projects[k];
                project_names.push(project.name);
                project_hours.push(project.hours)
            }

            const statistics = await getApplicationStatistics();
            const employees = await getEmployees();
            // rearrange data as needed for graphic historicBar
            let employee_names = [];
            let employee_applications_approved = [];
            let employee_applications_rejected = [];
            for (const e of employees) {
                if (statistics.hasOwnProperty(e.id)) { //check if employee even has a leave application history
                    employee_names.push(e.name);
                    employee_applications_approved.push(statistics[e.id].approved_applications);
                    employee_applications_rejected.push(statistics[e.id].rejected_applications);
                }
            }
            node.innerHTML = `
                <div style="width: 100%; height: 100%; margin: auto; text-align: center;">
                    <div style="float:left; width:auto; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px; margin: 10px;">
                        <div style="padding-block: 5px;">
                            <span style="width: 100%; font-size: x-large; margin: 20px;">
                                Needed hours per month
                            </span>
                        </div>
                        <div style="padding-block: 5px;">   
                            <canvas id="projectsDoughnut" width="500" height="500"></canvas>
                        </div>
                    </div>
                    <div style="float:left; width: auto; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px; margin: 10px;">
                        <div style="padding-block: 5px;">
                                <span style="width: 100%; font-size: x-large; margin: 20px;">
                                    Application History
                                </span>
                            </div>
                        <div style="padding-block: 5px;">   
                            <canvas id="pastRequestsChart" width="1000" height="500"></canvas>
                        </div>     
                    </div>
                    <div style="float:left; width: auto; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px; margin: 10px;">
                        <div style="padding-block: 5px;">
                            <span style="width: 100%; font-size: x-large; margin: 20px">
                                Variables
                            </span>
                        </div>
                        <div style=" width: 300px; margin: auto;">   
                            <table style="width: 92%; margin: 4%; text-align: left;">
                                <!--<tr><th style="padding-bottom: 10px;">Name</th><th style="padding-bottom: 10px;">Value</th></tr>-->
                                <tr><td style="padding-bottom: 15px;">Employee</td><td style="padding-bottom: 15px;">`+ employeeName +`</td></tr>
                                <tr><td>Start Date</td><td>`+ startTime.toDateString() +`</td></tr>
                                <tr><td style="border-bottom: 4px double gray;">End Date</td><td style="border-bottom: 4px double gray;">`+ endTime.toDateString() +`</td></tr>
                                <tr><td>→ Requested Days</td><td>`+ ((endTime-startTime)/86400000) +`</td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = () => {
                // #accepted vs #rejected applications
                const pr = document.getElementById('pastRequestsChart').getContext('2d');
                const historyBar = new Chart(pr, {
                    type: 'bar',
                    data: {
                        labels: employee_names,
                        datasets: [{
                            label: 'accepted applications',
                            data: employee_applications_approved,
                            backgroundColor: [
                                'rgb(14, 112, 28, 0.2)'
                            ],
                            borderColor: [
                                'rgb(14, 112, 28)'
                            ],
                            borderWidth: 1
                        }, {
                            label: 'rejected applications',
                            data: employee_applications_rejected,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)'
                            ],
                            borderColor: [
                                'rgb(255, 99, 132)'
                            ],
                            borderWidth: 1

                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                stacked: true,
                                ticks: {
                                    stepSize: 1
                                }
                            },
                            x: {
                                stacked: true
                            }
                        }
                    }
                });
                //Ongoing Projects
                const pd = document.getElementById('projectsDoughnut').getContext('2d');
                const projectsDoughnut = new Chart(pd, {
                    type: 'doughnut',
                    data: {
                        labels: project_names, //['Project 1', 'Project 2', 'Project 3', 'Project 4', 'Project 5', 'Unused hours']
                        datasets: [{
                            label: 'needed hours',
                            data: project_hours, //[120, 190, 300, 150, 90, 350]
                            backgroundColor: [
                                'rgba(35,128,48, 0.8)',
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255,131,64,0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)'
                            ],
                            borderColor: [
                                'rgb(35,128,48)',
                                'rgb(255, 99, 132)',
                                'rgb(255, 131, 64)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)'
                            ],
                            borderWidth: 1,
                            radius: '80%',
                            spacing: 7,
                            cutout: '70%',
                            rotation: 50
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            title: {
                                display: false,
                                text: 'workload'
                            }
                        }
                    }
                });

            }
            script.onerror = () => {
                console.error('Chart.js could not be loaded.');
            };
            document.head.appendChild(script);
        }
        // Process: Vacation Request
        // Activity: Check request by Group Leader
        else if (activityId === "check_gl") {
            node.innerHTML = `
            <div style="width: 100%; height: 100%; margin: auto; text-align: center;">
                 <div style="float:left; width: auto; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px; margin: 10px;">
                        <div style="padding-block: 5px;">
                            <span style="width: 100%; font-size: x-large; margin: 20px">
                                Weekly hours per employee
                            </span>
                        </div>
                        <div style="padding-block: 5px;">   
                            <canvas id="weeklyHoursChart" width="400" height="700"></canvas>
                        </div>
                    </div>
                <div style="float:left; width: auto; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px; margin: 10px;">
                    <div style="padding-block: 5px;">
                        <span style="width: 100%; font-size: x-large; margin: 20px">
                            Current Workload
                        </span>
                    </div>
                    <div style="padding-block: 5px;">   
                        <canvas id="currentWorkloadChart" width="1400" height="700"></canvas>
                    </div>
                </div>
                <div style="float:left; width: auto; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px; margin: 10px;">
                    <div style="padding-block: 5px;">
                        <span style="width: 100%; font-size: x-large; margin: 20px">
                            Variables
                        </span>
                    </div>
                    <div style=" width: 300px; margin: auto;">   
                        <table style="width: 92%; margin: 4%; text-align: left;">
                            <!--<tr><th style="padding-bottom: 10px;">Name</th><th style="padding-bottom: 10px;">Value</th></tr>-->
                            <tr><td style="padding-bottom: 15px;">Employee</td><td style="padding-bottom: 15px;">`+ employeeName +`</td></tr>
                            <tr><td>Start Date</td><td>`+ startTime.toDateString() +`</td></tr>
                            <tr><td style="border-bottom: 4px double gray;">End Date</td><td style="border-bottom: 4px double gray;">`+ endTime.toDateString() +`</td></tr>
                            <tr><td>→ Requested Days</td><td>`+ ((endTime-startTime)/86400000) +`</td></tr>
                        </table>
                    </div>
                </div>
            </div>
            `;
            const script1 = document.createElement('script');
            script1.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script1.async = false;
            script1.onerror = () => {
                console.error('Chart.js could not be loaded.');
            };
            document.body.appendChild(script1);
            const script = document.createElement('script');
            script.async = false;
            script.src = "https://cdn.jsdelivr.net/npm//chartjs-plugin-annotation/dist/chartjs-plugin-annotation.min.js"
            const employees = await getEmployees().valueOf();
            const employee_names = [];
            const employee_hours = [];
            for (const e in employees) {
                const employee = employees[e];
                employee_names.push(employee.name);
                employee_hours.push(employee.weekly_hours)
            }

            //Data preparation for workload chart
            let datasets = [];
            let labels = [];
            let annotations = {};
            const workload = await getUserWorkload();
            console.log(workload);
            console.log(getProcessVariables('db6a0db9-32d8-11ef-9066-1ef3fdbca0ce'));
            let n = 0;
            for (const a in workload) {
                let assignee = workload[a];
                let assigneeName = '';
                if (a === 'null') {
                    assigneeName = 'not assigned'
                    labels.push('not assigned');
                }
                 else {
                     assigneeName = await getEmployeeName(a);
                     labels.push(assigneeName);
                }
                 let yAnnotation = 0;
                 let m = 0;
                for (const activity in assignee) {
                    let activityWorkload = assignee[activity];
                    let data = new Array(workload.length);
                    yAnnotation += activityWorkload/2;
                    data[n] = activityWorkload;
                    let r = Math.floor(Math.random() * 254) + 1
                    let g = Math.floor(Math.random() * 254) + 1
                    let b = Math.floor(Math.random() * 254) + 1
                    let dataset = {
                        data: data,
                        label: activity,
                        backgroundColor: [
                            ('rgba('+r+','+g+','+b+',0.2)')
                        ],
                        borderColor: [
                            ('rgba('+r+','+g+','+b+',0.9)')
                        ],
                        borderWidth: 1
                    }
                    annotations[('label'+n+'_'+m)] = {
                        type: 'label',
                        xValue: assigneeName,
                        yValue: yAnnotation,
                        content: [await getActivityName(activity)],
                        position: 'center'
                    }
                    datasets.push(dataset);
                    yAnnotation += activityWorkload/2;
                    m++;
                }
                n++;
            }

            //Load Script for Group Leader context charts
            script.onload = () => {
                // weekly hours for every employee
                const whc = document.getElementById('weeklyHoursChart').getContext('2d');
                const whChart = new Chart(whc, {
                    type: 'bar',
                    data: {
                        labels: employee_names,
                        datasets: [{
                            label: 'weekly hours',
                            data: employee_hours,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)'
                            ],
                            borderColor: [
                                'rgb(255, 99, 132)',
                                'rgb(255, 159, 64)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });

                // current workload per employee
                /* TODO: Test later?
                const LabelNames = {
                    id: 'LabelNames',
                    afterDatasetsDraw(chart, args, pluginOptions) {
                        const { ctx } = chart;

                    }
                }*/
                //TODO check if getContext('2d') is needed and why
                const cw = document.getElementById('currentWorkloadChart').getContext('2d');
                const workloadBar = new Chart(cw, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                stacked: true,
                                ticks: {
                                    stepSize: 5
                                },
                                suggestedMax: 40,
                                grid: {
                                    drawBorder: false,
                                    color: function(context) {
                                        if (context.tick.value === 20 || context.tick.value === 30 || context.tick.value === 40) {
                                            return 'rgba(0, 0, 0, 0.2)'; // Farbe der dickeren Linie
                                        }
                                        return 'rgba(0, 0, 0, 0.1)'; // Standardfarbe der Linie
                                    },
                                    lineWidth: function(context) {
                                        if (context.tick.value === 20 || context.tick.value === 30 || context.tick.value === 40) {
                                            return 2; // Dickere Linie
                                        }
                                        return 1; // Standarddicke der Linie
                                    }
                                }
                            },
                            x: {
                                stacked: true
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            annotation: {
                                annotations: annotations
                            }
                        }
                    }
                });
                // TODO
            };
            script.onerror = () => {
                console.error('chartjs-plugin-datalabels an charts could not be loaded.');
            };
            document.head.appendChild(script);
        }
        //without special context
        else {
            node.innerHTML = `
                  <div>
                    <button class="btn btn-default action-button" style="width: 40px; margin-top: 5px;">
                      <img src="../scripts/corgi.gif" width="20" alt="Corgi"/>
                    </button>
                    <div>
                      ProcessInstanceId: ${processInstanceId}
                      <br>
                      ActivityID: ` + activityId + `
                      <br>
                      <span style="display: flex; justify-content: center; text-underline: thick;">Charts</span>
                      <div style="width: 100%; height: 100%; padding-block: 20px">
                        <div style="float:left; width:49%; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px;">
                            <canvas id="myChart" width="50" height="10"></canvas>
                        </div>
                        <div style="float:right; width: 49%; height: auto; border-width: thin; border-color: lightgray; border-style: solid; border-radius: 10px;">
                            <canvas id="myChart2" width="50" height="10"></canvas>
                        </div>
                      </div>
                    </div>
                  </div>
            `;

            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = () => {
                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                const ctx2 = document.getElementById('myChart2').getContext('2d');
                const myChart2 = new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            borderColor: [
                                'rgb(134,75,88)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            };
            script.onerror = () => {
                console.error('Chart.js could not be loaded.');
            };
            document.head.appendChild(script);

            // onclick function for our button
            node.onclick = function () {
                /*
                console.log("ID: " + processInstanceId);
                const processes = processesHistory();
                processes.then(value => {
                    console.log(value[0].startTime)
                });
                const test = testHistory();
                test.then(value => console.log(value));
                const employees = getEmployees();
                employees.then(value => console.log(value));
                 */
                const variables = getProcessVariables(processInstanceId);
                variables.then(value => console.log(value));
                const statistic = getApplicationStatistics();
                statistic.then(value => console.log(value));
                const user_workload = getUserWorkload();
                user_workload.then(value => console.log(value));
            };
        }
    }
};

async function getProjects() {
    const response = await fetch("http://localhost:8080/projects");
    return await response.json();
}

async function getEmployees() {
    const response = await fetch("http://localhost:8080/employees");
    return await response.json();
}

async function getCompletedProcesses() {
    const response = await fetch("http://localhost:8080/completed-processes");
    return await response.json();
}

async function getApplicationStatistics() {
    // employee_name, #rejected_applications, #accepted_applications
    let application_statistics = {};
    const completed_processes = await getCompletedProcesses();
    for (const process of completed_processes) {
        const employee = (await getProcessVariables(process.processInstanceId)).employee;
        if (!application_statistics.hasOwnProperty(employee)) {
            application_statistics[employee] = {rejected_applications: 0, approved_applications: 0, name: employee};
        }
        if (process.processDefinitionKey === 'leave_request') {
            if (process.endActivityId === 'application_approved') {
                application_statistics[employee]['approved_applications'] += 1;
            }
            else if (process.endActivityId === 'application_rejected') {
                application_statistics[employee]['rejected_applications'] += 1;
            }
        }
    }
    return application_statistics;
}

async function getProcessVariables(processInstanceId) {
    //TODO: multiple workload_in_hours (how to take newest)
    let variables = {};
    const variables_response = await (await fetch("http://localhost:8080/processes/details")).json();
    for (const variables_raw of variables_response) {
        if (!variables_raw.hasOwnProperty(0)) {}
        else if (variables_raw[0].processInstanceId === processInstanceId) {
            for (const variable_raw of variables_raw) {
                variables[variable_raw.name] = variable_raw.value;
            }
        }
    }
    return variables;
}

async function getCurrentActivity(api, processInstanceId) {
    const response = await fetch(api.engineApi + "/process-instance/" + processInstanceId + "/activity-instances", {
        method: 'get',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": api.CSRFToken,
        }
    });
    let value = await response.json();
    let activityId;
    let activityName;
    activityId = value.childActivityInstances[0].activityId
    activityName = value.childActivityInstances[0].activityName
    return {"id": activityId, "name": activityName}
}

//  { user_1: {activityID_1: working hours_1, ..., activityID_n: working hours_n}, ... }
async function getUserWorkload()  {
    const activities = await (await fetch("http://localhost:8080/activities/running")).json();
    let user_activities = {}
    for (const activity of activities) {
        const variables = await getProcessVariables(activity.processInstanceId)
        if (activity.processDefinitionKey === 'order') {
            if (!user_activities.hasOwnProperty(activity.assignee)) {user_activities[activity.assignee] = {}}
            user_activities[activity.assignee][activity.id] = variables['workload_in_hours'];
        }
    }
    return user_activities;
}

async function getEmployeeName(employeeId) {
    let employees = await getEmployees();
    for (const employee of employees) {
        if (employee.id === employeeId) {
            return employee.name;
        }
    }
    return 'no name found'
}

async function getActivityName(activityId)  {
    let activities = await (await fetch("http://localhost:8080/activities/running")).json();
    for (const activity of activities) {
        if (activity.id === activityId) {
            return activity.activityName
        }
    }
}