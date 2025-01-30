package com.example.taskmanager.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name; // Nom de la catégorie 

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnore // Pour éviter une boucle infinie
    private List<Task> tasks;

    // Constructeur sans argument 
    public Category() {
    }

    // Constructeur avec le nom 
    public Category(String name) {
        this.name = name;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }    
}