package yeomeong.common.dto.kindergarten;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import yeomeong.common.dto.ban.BanBasicInfoResponseDto;
import yeomeong.common.entity.kindergarten.Bus;
import yeomeong.common.entity.kindergarten.Kindergarten;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class KindergartenInfoResponseDto {

    private long id;
    private String name;
    private String address;
    private String addressDetail;
    private String tel;
    private Bus bus;
    private LocalDate openDate;
    @Builder.Default
    private List<BanBasicInfoResponseDto> bans = new ArrayList<>();

    public static KindergartenInfoResponseDto toKindergartenDto(Kindergarten kindergarten) {
        return KindergartenInfoResponseDto.builder()
            .id(kindergarten.getId())
            .name(kindergarten.getName())
            .address(kindergarten.getAddress())
            .addressDetail(kindergarten.getAddressDetail())
            .tel(kindergarten.getTel())
            .bus(kindergarten.getBus())
            .openDate(kindergarten.getOpenDate())
            .bans(kindergarten.getBans().stream()
                    .map(BanBasicInfoResponseDto::toBanBasicInfoDto)
                    .collect(Collectors.toList()))
            .build();
    }

}
