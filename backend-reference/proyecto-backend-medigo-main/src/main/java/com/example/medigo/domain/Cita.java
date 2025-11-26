package com.example.medigo.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "cita")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    @JsonBackReference
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id", nullable = false)
    @JsonBackReference
    private Medico medico;

    @Column(nullable = false)
    private ZonedDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    private EstadoCita estado;

    @Column(name = "precio_consulta", precision = 10, scale = 2)
    private BigDecimal precioConsulta;

    @Column(name = "es_pagada")
    private Boolean esPagada = false;

    @Column(name = "stripe_session_id")
    private String stripeSessionId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
        if (esPagada == null) {
            esPagada = false;
        }
    }
}
