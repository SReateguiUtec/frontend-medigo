package com.example.medigo.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.medigo.domain.Medico;
import com.example.medigo.domain.Paciente;
import com.example.medigo.domain.Rol;
import com.example.medigo.domain.Usuario;
import com.example.medigo.domain.EstadoCuenta;
import com.example.medigo.dto.response.MedicoResponseDto;
import com.example.medigo.dto.response.PacienteResponseDto;
import com.example.medigo.dto.response.UpdateEstadoCuentaDto;
import com.example.medigo.exceptions.UserAlreadyExistsException;
import com.example.medigo.exceptions.UserNotFoundException;
import com.example.medigo.repository.UsuarioRepository;
import com.example.medigo.repository.EspecialidadRepository;
import com.example.medigo.domain.Especialidad;
import java.util.Collections;
import java.util.HashSet;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UsuarioRepository usuarioRepository;
    private final EspecialidadRepository especialidadRepository;
    private final ModelMapper modelMapper;

    private Usuario obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado."));
    }

    @Transactional
    public Object updateUserProfile(String email, Map<String, Object> updates) {
        Usuario usuario = obtenerUsuarioPorEmail(email);

        if (usuario.getRol() == Rol.PACIENTE) {
            return updatePacienteProfile((Paciente) usuario, updates);
        } else if (usuario.getRol() == Rol.MEDICO) {
            return updateMedicoProfile((Medico) usuario, updates);
        }
        throw new IllegalStateException("Rol de usuario no válido.");
    }

    @Transactional(readOnly = true)
    public Object getUserProfile(String email) {
        Usuario usuario = obtenerUsuarioPorEmail(email);
        
        // Debug logging to check account status
        System.out.println("=== GET USER PROFILE DEBUG ===");
        System.out.println("User email: " + email);
        System.out.println("User role: " + usuario.getRol());
        System.out.println("Account status: " + usuario.getEstadoCuenta());
        System.out.println("==============================");

        if (usuario.getRol() == Rol.PACIENTE) {
            Paciente paciente = (Paciente) usuario;
            return modelMapper.map(paciente, PacienteResponseDto.class);
        } else if (usuario.getRol() == Rol.MEDICO) {
            Medico medico = (Medico) usuario;
            MedicoResponseDto response = modelMapper.map(medico, MedicoResponseDto.class);
            // Debug logging for response
            System.out.println("Response DTO account status: " + response.getEstadoCuenta());
            return response;
        }
        throw new IllegalStateException("Rol de usuario no válido.");
    }

    private Object updatePacienteProfile(Paciente paciente, Map<String, Object> updates) {
        System.out.println("=== Patient Profile Update Debug Info ===");
        System.out.println("Patient email: " + paciente.getEmail());
        System.out.println("Current account status before update: " + paciente.getEstadoCuenta());
        System.out.println("Updates received: " + updates);
        System.out.println("====================================");

        // Campos de Usuario (clase padre): nombres, apellidos, email, telefono, edad,
        // rutaFoto
        if (updates.containsKey("nombres")) {
            paciente.setNombres((String) updates.get("nombres"));
        }
        if (updates.containsKey("apellidos")) {
            paciente.setApellidos((String) updates.get("apellidos"));
        }
        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            if (newEmail != null && !newEmail.isEmpty() &&
                    !newEmail.equals(paciente.getEmail() != null ? paciente.getEmail() : "") &&
                    usuarioRepository.existsByEmail(newEmail)) {
                throw new UserAlreadyExistsException("Email ya está en uso.");
            }
            paciente.setEmail(newEmail);
        }
        if (updates.containsKey("telefono")) {
            String newTelefono = (String) updates.get("telefono");
            if (newTelefono != null && !newTelefono.isEmpty() &&
                    !newTelefono.equals(paciente.getTelefono() != null ? paciente.getTelefono() : "") &&
                    usuarioRepository.findByTelefono(newTelefono).isPresent()) {
                throw new UserAlreadyExistsException("Teléfono ya está en uso.");
            }
            paciente.setTelefono(newTelefono);
        }
        if (updates.containsKey("edad")) {
            Object edadObj = updates.get("edad");
            if (edadObj instanceof Integer) {
                paciente.setEdad((Integer) edadObj);
            } else if (edadObj instanceof String) {
                try {
                    paciente.setEdad(Integer.parseInt((String) edadObj));
                } catch (NumberFormatException e) {
                }
            }
        }

        // Campos específicos de Paciente: dni, fechaNacimiento
        if (updates.containsKey("dni")) {
            paciente.setDni((String) updates.get("dni"));
        }
        if (updates.containsKey("fechaNacimiento")) {
            String fechaStr = (String) updates.get("fechaNacimiento");
            if (fechaStr != null && !fechaStr.isEmpty()) {
                paciente.setFechaNacimiento(LocalDate.parse(fechaStr));
            }
        }

        // Ensure account status is preserved
        System.out.println("Account status before preservation check: " + paciente.getEstadoCuenta());
        if (paciente.getEstadoCuenta() == null) {
            paciente.setEstadoCuenta(com.example.medigo.domain.EstadoCuenta.ACTIVADA);
            System.out.println("Account status was null, set to ACTIVADA");
        } else {
            System.out.println("Account status was not null, keeping: " + paciente.getEstadoCuenta());
        }
        System.out.println("Final account status: " + paciente.getEstadoCuenta());

        usuarioRepository.save(paciente);
        PacienteResponseDto response = modelMapper.map(paciente, PacienteResponseDto.class);
        System.out.println("Response DTO account status: " + response.getEstadoCuenta());
        System.out.println("====================================");
        return response;
    }

    private Object updateMedicoProfile(Medico medico, Map<String, Object> updates) {
        System.out.println("=== Doctor Profile Update Debug Info ===");
        System.out.println("Doctor email: " + medico.getEmail());
        System.out.println("Current account status before update: " + medico.getEstadoCuenta());
        System.out.println("Updates received: " + updates);
        System.out.println("====================================");

        // Campos de Usuario (clase padre): nombres, apellidos, email, telefono, edad,
        // rutaFoto
        if (updates.containsKey("nombres")) {
            medico.setNombres((String) updates.get("nombres"));
        }
        if (updates.containsKey("apellidos")) {
            medico.setApellidos((String) updates.get("apellidos"));
        }
        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            if (newEmail != null && !newEmail.isEmpty() &&
                    !newEmail.equals(medico.getEmail() != null ? medico.getEmail() : "") &&
                    usuarioRepository.existsByEmail(newEmail)) {
                throw new UserAlreadyExistsException("Email ya está en uso.");
            }
            medico.setEmail(newEmail);
        }
        if (updates.containsKey("telefono")) {
            String newTelefono = (String) updates.get("telefono");
            if (newTelefono != null && !newTelefono.isEmpty() &&
                    !newTelefono.equals(medico.getTelefono() != null ? medico.getTelefono() : "") &&
                    usuarioRepository.findByTelefono(newTelefono).isPresent()) {
                throw new UserAlreadyExistsException("Teléfono ya está en uso.");
            }
            medico.setTelefono(newTelefono);
        }
        if (updates.containsKey("edad")) {
            Object edadObj = updates.get("edad");
            if (edadObj instanceof Integer) {
                medico.setEdad((Integer) edadObj);
            } else if (edadObj instanceof String) {
                try {
                    medico.setEdad(Integer.parseInt((String) edadObj));
                } catch (NumberFormatException e) {
                }
            }
        }

        // Campos específicos de Medico: dni, numeroColegiado, bio, precioConsulta
        if (updates.containsKey("dni")) {
            medico.setDni((String) updates.get("dni"));
        }
        if (updates.containsKey("numeroColegiado")) {
            System.out.println("Updating numeroColegiado to: " + updates.get("numeroColegiado"));
            medico.setNumeroColegiado((String) updates.get("numeroColegiado"));
        }
        if (updates.containsKey("bio")) {
            medico.setBio((String) updates.get("bio"));
        }
        if (updates.containsKey("precioConsulta")) {
            Object precioObj = updates.get("precioConsulta");
            BigDecimal precio = null;
            try {
                if (precioObj instanceof Double) {
                    precio = BigDecimal.valueOf((Double) precioObj);
                } else if (precioObj instanceof String) {
                    precio = new BigDecimal((String) precioObj);
                } else if (precioObj instanceof Integer) {
                    precio = BigDecimal.valueOf(((Integer) precioObj).doubleValue());
                } else if (precioObj instanceof BigDecimal) {
                    precio = (BigDecimal) precioObj;
                } else if (precioObj != null) {
                    
                    precio = new BigDecimal(precioObj.toString());
                }
            } catch (NumberFormatException e) {
                // If we can't parse the price, we'll leave it as null and not update
                // This prevents errors when invalid data is sent
            }
            if (precio != null) {
                medico.setPrecioConsulta(precio);
            }
        }

        if (updates.containsKey("especialidad")) {
            String especialidadNombre = (String) updates.get("especialidad");
            if (especialidadNombre != null && !especialidadNombre.isEmpty()) {
                System.out.println("Searching for specialty: " + especialidadNombre);
                // Create or find the specialty
                Especialidad especialidad = especialidadRepository.findByNombre(especialidadNombre)
                        .orElseGet(() -> {
                            // If specialty doesn't exist, create it
                            Especialidad newEspecialidad = new Especialidad();
                            newEspecialidad.setNombre_especialidad(especialidadNombre);
                            return especialidadRepository.save(newEspecialidad);
                        });

                if (especialidad != null) {
                    System.out.println("Specialty found/created: " + especialidad.getId());
                    medico.setEspecialidades(new HashSet<>(Collections.singletonList(especialidad)));
                } else {
                    System.out.println("Failed to create/find specialty: " + especialidadNombre);
                }
            }
        }

        // Ensure account status is preserved
        System.out.println("Account status before preservation check: " + medico.getEstadoCuenta());
        if (medico.getEstadoCuenta() == null) {
            medico.setEstadoCuenta(com.example.medigo.domain.EstadoCuenta.ACTIVADA);
            System.out.println("Account status was null, set to ACTIVADA");
        } else {
            System.out.println("Account status was not null, keeping: " + medico.getEstadoCuenta());
        }
        System.out.println("Final account status: " + medico.getEstadoCuenta());

        usuarioRepository.save(medico);
        MedicoResponseDto response = modelMapper.map(medico, MedicoResponseDto.class);
        System.out.println("Response DTO account status: " + response.getEstadoCuenta());
        System.out.println("====================================");
        return response;
    }

    @Transactional
    public Object updateAccountStatus(String email, UpdateEstadoCuentaDto statusDto) {
        Usuario usuario = obtenerUsuarioPorEmail(email);
        usuario.setEstadoCuenta(statusDto.getEstadoCuenta());
        usuarioRepository.save(usuario);

        if (usuario.getRol() == Rol.PACIENTE) {
            return modelMapper.map(usuario, PacienteResponseDto.class);
        } else if (usuario.getRol() == Rol.MEDICO) {
            return modelMapper.map(usuario, MedicoResponseDto.class);
        }
        throw new IllegalStateException("Rol de usuario no válido.");
    }
}
