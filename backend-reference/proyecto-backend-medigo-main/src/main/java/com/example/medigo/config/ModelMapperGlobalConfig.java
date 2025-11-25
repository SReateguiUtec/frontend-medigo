package com.example.medigo.config;

import com.example.medigo.domain.Medico;
import com.example.medigo.dto.response.MedicoResponseDto;
import com.example.medigo.dto.response.MedicoSearchResponseDto;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperGlobalConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STANDARD)
                .setSkipNullEnabled(true);
    
        mapper.createTypeMap(Medico.class, MedicoSearchResponseDto.class)
                .addMapping(Medico::getNumeroColegiado, MedicoSearchResponseDto::setNumeroColegiado)
                .addMapping(Medico::getBio, MedicoSearchResponseDto::setBio);
        
        mapper.createTypeMap(Medico.class, MedicoResponseDto.class)
                .addMapping(Medico::getNumeroColegiado, MedicoResponseDto::setNumeroColegiado)
                .addMapping(Medico::getBio, MedicoResponseDto::setBio);
        
        return mapper;
    }
}