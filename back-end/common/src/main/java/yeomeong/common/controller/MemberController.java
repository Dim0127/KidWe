package yeomeong.common.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import yeomeong.common.dto.member.JoinRequestDto;
import yeomeong.common.security.jwt.JwtService;
import yeomeong.common.security.jwt.JwtUtil;
import yeomeong.common.service.MemberService;

@Slf4j
@RestController
public class MemberController {

    @Autowired
    MemberService memberService;

    @Autowired
    JwtService jwtService;

    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody JoinRequestDto joinRequestDto) {
        memberService.joinMember(joinRequestDto);
        return ResponseEntity.ok("회원가입 완료");
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refresh(@RequestHeader("Authorization") String refreshToken) {
        if (jwtService.isCorrectToken(refreshToken)) {
            return ResponseEntity.ok(jwtService.createAccessToken(refreshToken));
        }
        return null;
    }

    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("home");
    }

    @GetMapping("/logoutsuccess")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        log.info("[LOGOUT] {}", token);
        if (!jwtService.isCorrectToken(token)) {
            return null;
        }
        jwtService.saveLogoutAccessToken(token);
        jwtService.deleteRefreshToken(JwtUtil.getLoginEmail(JwtUtil.removeBearerPrefix(token)));
        return ResponseEntity.ok("logout success");
    }

}