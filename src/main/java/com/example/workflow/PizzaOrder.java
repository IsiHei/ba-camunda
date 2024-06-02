package com.example.workflow;

import jakarta.inject.Named;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

@Named
public class PizzaOrder implements JavaDelegate {
    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String money = "0.00";
        String pizzaType;
        money = (String) delegateExecution.getVariable("money");
        double moneyDouble = Double.parseDouble(money);
        if (moneyDouble > 12) {
            pizzaType = "salami";
        } else if (moneyDouble > 5){
            pizzaType = "margherita";
        } else {
            pizzaType = "bread";
            throw new BpmnError("Still_hungry", "Not enough money.");
        }
        delegateExecution.setVariable("pizzaType", pizzaType);
    }
}
