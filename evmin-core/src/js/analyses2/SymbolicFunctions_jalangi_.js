J$.noInstrEval = false;
jalangiLabel10:
    while (true) {
        try {
            J$.Se(4417, 'src/js/analyses2/SymbolicFunctions_jalangi_.js');
            J$.F(4409, J$.T(4385, function (sandbox) {
                jalangiLabel9:
                    while (true) {
                        try {
                            J$.Fe(4345, arguments.callee, this, arguments);
                            function regex_escape(text) {
                                jalangiLabel0:
                                    while (true) {
                                        try {
                                            J$.Fe(49, arguments.callee, this, arguments);
                                            arguments = J$.N(57, 'arguments', arguments, true, false);
                                            text = J$.N(65, 'text', text, true, false);
                                            return J$.Rt(41, J$.M(33, J$.R(9, 'text', text, false, false), 'replace', false)(J$.T(17, /[-[\]{}()*+?.,\\^$|#\s]/g, 14, false), J$.T(25, '\\$&', 21, false)));
                                        } catch (J$e) {
                                            J$.Ex(4425, J$e);
                                        } finally {
                                            if (J$.Fr(4433))
                                                continue jalangiLabel0;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }
                            arguments = J$.N(4353, 'arguments', arguments, true, false);
                            sandbox = J$.N(4361, 'sandbox', sandbox, true, false);
                            J$.N(4377, 'regex_escape', J$.T(4369, regex_escape, 12, false), false, false);
                            J$.P(809, J$.R(73, 'sandbox', sandbox, false, false), 'string_indexOf', J$.T(801, function (result, str, startPos) {
                                jalangiLabel1:
                                    while (true) {
                                        try {
                                            J$.Fe(713, arguments.callee, this, arguments);
                                            arguments = J$.N(721, 'arguments', arguments, true, false);
                                            result = J$.N(729, 'result', result, true, false);
                                            str = J$.N(737, 'str', str, true, false);
                                            startPos = J$.N(745, 'startPos', startPos, true, false);
                                            J$.N(753, 'reg', reg, false, false);
                                            J$.N(761, 'ret', ret, false, false);
                                            J$.N(769, 'T', T, false, false);
                                            J$.N(777, 'S1', S1, false, false);
                                            J$.N(785, 'S2', S2, false, false);
                                            J$.N(793, 'pos', pos, false, false);
                                            var reg = J$.W(137, 'reg', J$.F(129, J$.I(typeof RegExp === 'undefined' ? RegExp = J$.R(81, 'RegExp', undefined, true, true) : RegExp = J$.R(81, 'RegExp', RegExp, true, true)), true)(J$.B(18, '+', J$.B(10, '+', J$.T(89, '.*', 21, false), J$.F(113, J$.R(97, 'regex_escape', regex_escape, false, false), false)(J$.R(105, 'str', str, false, false))), J$.T(121, '.*', 21, false))), reg, false, false);
                                            var ret = J$.W(161, 'ret', J$.readInput(J$.R(145, 'result', result, false, false), J$.T(153, true, 23, false)), ret, false, false);
                                            startPos = J$.W(185, 'startPos', J$.B(26, '|', J$.R(169, 'startPos', startPos, false, false), J$.T(177, 0, 22, false)), startPos, false, false);
                                            J$.addAxiom(J$.T(193, 'begin', 21, false));
                                            J$.addAxiom(J$.T(201, 'begin', 21, false));
                                            var T = J$.W(225, 'T', J$.readInput(J$.T(209, '', 21, false), J$.T(217, true, 23, false)), T, false, false);
                                            var S1 = J$.W(249, 'S1', J$.readInput(J$.T(233, '', 21, false), J$.T(241, true, 23, false)), S1, false, false);
                                            var S2 = J$.W(273, 'S2', J$.readInput(J$.T(257, '', 21, false), J$.T(265, true, 23, false)), S2, false, false);
                                            var pos = J$.W(297, 'pos', J$.readInput(J$.T(281, 0, 22, false), J$.T(289, true, 23, false)), pos, false, false);
                                            J$.addAxiom(J$.T(305, 'begin', 21, false));
                                            J$.addAxiom(J$.T(313, 'begin', 21, false));
                                            J$.addAxiom(J$.B(34, '<', J$.R(321, 'startPos', startPos, false, false), J$.G(337, J$.R(329, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(42, '>=', J$.R(345, 'startPos', startPos, false, false), J$.T(353, 0, 22, false)));
                                            J$.addAxiom(J$.B(50, '===', J$.R(361, 'pos', pos, false, false), J$.R(369, 'startPos', startPos, false, false)));
                                            J$.addAxiom(J$.T(377, 'and', 21, false));
                                            J$.addAxiom(J$.T(385, 'begin', 21, false));
                                            J$.addAxiom(J$.B(58, '<', J$.R(393, 'startPos', startPos, false, false), J$.T(401, 0, 22, false)));
                                            J$.addAxiom(J$.B(66, '===', J$.R(409, 'pos', pos, false, false), J$.T(417, 0, 22, false)));
                                            J$.addAxiom(J$.T(425, 'and', 21, false));
                                            J$.addAxiom(J$.T(433, 'begin', 21, false));
                                            J$.addAxiom(J$.B(74, '>=', J$.R(441, 'startPos', startPos, false, false), J$.G(457, J$.R(449, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(82, '===', J$.R(465, 'pos', pos, false, false), J$.G(481, J$.R(473, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.T(489, 'and', 21, false));
                                            J$.addAxiom(J$.T(497, 'or', 21, false));
                                            J$.addAxiom(J$.B(90, '===', J$.R(505, 'pos', pos, false, false), J$.G(521, J$.R(513, 'T', T, false, false), 'length')));
                                            J$.addAxiom(J$.B(122, '===', J$.R(529, 'this', this, false, false), J$.B(114, '+', J$.B(106, '+', J$.B(98, '+', J$.R(537, 'T', T, false, false), J$.R(545, 'S1', S1, false, false)), J$.R(553, 'str', str, false, false)), J$.R(561, 'S2', S2, false, false))));
                                            J$.addAxiom(J$.B(138, '===', J$.R(569, 'ret', ret, false, false), J$.B(130, '+', J$.R(577, 'pos', pos, false, false), J$.G(593, J$.R(585, 'S1', S1, false, false), 'length'))));
                                            J$.addAxiom(J$.U(146, '!', J$.M(617, J$.R(601, 'reg', reg, false, false), 'test', false)(J$.R(609, 'S1', S1, false, false))));
                                            J$.addAxiom(J$.T(625, 'and', 21, false));
                                            J$.addAxiom(J$.T(633, 'begin', 21, false));
                                            J$.addAxiom(J$.B(162, '===', J$.R(641, 'ret', ret, false, false), J$.U(154, '-', J$.T(649, 1, 22, false))));
                                            J$.addAxiom(J$.U(170, '!', J$.M(673, J$.R(657, 'reg', reg, false, false), 'test', false)(J$.R(665, 'this', this, false, false))));
                                            J$.addAxiom(J$.T(681, 'and', 21, false));
                                            J$.addAxiom(J$.T(689, 'or', 21, false));
                                            return J$.Rt(705, J$.R(697, 'ret', ret, false, false));
                                        } catch (J$e) {
                                            J$.Ex(4441, J$e);
                                        } finally {
                                            if (J$.Fr(4449))
                                                continue jalangiLabel1;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }, 12, false));
                            J$.P(1601, J$.R(817, 'sandbox', sandbox, false, false), 'string_lastIndexOf', J$.T(1593, function (result, str, startPos) {
                                jalangiLabel2:
                                    while (true) {
                                        try {
                                            J$.Fe(1505, arguments.callee, this, arguments);
                                            arguments = J$.N(1513, 'arguments', arguments, true, false);
                                            result = J$.N(1521, 'result', result, true, false);
                                            str = J$.N(1529, 'str', str, true, false);
                                            startPos = J$.N(1537, 'startPos', startPos, true, false);
                                            J$.N(1545, 'reg', reg, false, false);
                                            J$.N(1553, 'ret', ret, false, false);
                                            J$.N(1561, 'T', T, false, false);
                                            J$.N(1569, 'S1', S1, false, false);
                                            J$.N(1577, 'S2', S2, false, false);
                                            J$.N(1585, 'pos', pos, false, false);
                                            var reg = J$.W(881, 'reg', J$.F(873, J$.I(typeof RegExp === 'undefined' ? RegExp = J$.R(825, 'RegExp', undefined, true, true) : RegExp = J$.R(825, 'RegExp', RegExp, true, true)), true)(J$.B(186, '+', J$.B(178, '+', J$.T(833, '.*', 21, false), J$.F(857, J$.R(841, 'regex_escape', regex_escape, false, false), false)(J$.R(849, 'str', str, false, false))), J$.T(865, '.*', 21, false))), reg, false, false);
                                            var ret = J$.W(905, 'ret', J$.readInput(J$.R(889, 'result', result, false, false), J$.T(897, true, 23, false)), ret, false, false);
                                            if (J$.C(8, J$.B(194, '===', J$.R(913, 'startPos', startPos, false, false), J$.T(921, undefined, 24, false)))) {
                                                J$.Ce(4457, 8);
                                                startPos = J$.W(953, 'startPos', J$.B(202, '-', J$.G(937, J$.R(929, 'this', this, false, false), 'length'), J$.T(945, 1, 22, false)), startPos, false, false);
                                                J$.Cr(4465, 8);
                                            }
                                            J$.addAxiom(J$.T(961, 'begin', 21, false));
                                            J$.addAxiom(J$.T(969, 'begin', 21, false));
                                            var T = J$.W(993, 'T', J$.readInput(J$.T(977, '', 21, false), J$.T(985, true, 23, false)), T, false, false);
                                            var S1 = J$.W(1017, 'S1', J$.readInput(J$.T(1001, '', 21, false), J$.T(1009, true, 23, false)), S1, false, false);
                                            var S2 = J$.W(1041, 'S2', J$.readInput(J$.T(1025, '', 21, false), J$.T(1033, true, 23, false)), S2, false, false);
                                            var pos = J$.W(1065, 'pos', J$.readInput(J$.T(1049, 0, 22, false), J$.T(1057, true, 23, false)), pos, false, false);
                                            J$.addAxiom(J$.T(1073, 'begin', 21, false));
                                            J$.addAxiom(J$.T(1081, 'begin', 21, false));
                                            J$.addAxiom(J$.B(210, '<', J$.R(1089, 'startPos', startPos, false, false), J$.G(1105, J$.R(1097, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(218, '>=', J$.R(1113, 'startPos', startPos, false, false), J$.T(1121, 0, 22, false)));
                                            J$.addAxiom(J$.B(226, '===', J$.R(1129, 'pos', pos, false, false), J$.R(1137, 'startPos', startPos, false, false)));
                                            J$.addAxiom(J$.T(1145, 'and', 21, false));
                                            J$.addAxiom(J$.T(1153, 'begin', 21, false));
                                            J$.addAxiom(J$.B(234, '<', J$.R(1161, 'startPos', startPos, false, false), J$.T(1169, 0, 22, false)));
                                            J$.addAxiom(J$.B(250, '===', J$.R(1177, 'pos', pos, false, false), J$.U(242, '-', J$.T(1185, 1, 22, false))));
                                            J$.addAxiom(J$.T(1193, 'and', 21, false));
                                            J$.addAxiom(J$.T(1201, 'begin', 21, false));
                                            J$.addAxiom(J$.B(258, '>=', J$.R(1209, 'startPos', startPos, false, false), J$.G(1225, J$.R(1217, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(274, '===', J$.R(1233, 'pos', pos, false, false), J$.B(266, '-', J$.G(1249, J$.R(1241, 'this', this, false, false), 'length'), J$.T(1257, 1, 22, false))));
                                            J$.addAxiom(J$.T(1265, 'and', 21, false));
                                            J$.addAxiom(J$.T(1273, 'or', 21, false));
                                            J$.addAxiom(J$.B(298, '===', J$.R(1281, 'pos', pos, false, false), J$.B(290, '-', J$.B(282, '-', J$.G(1297, J$.R(1289, 'this', this, false, false), 'length'), J$.G(1313, J$.R(1305, 'T', T, false, false), 'length')), J$.T(1321, 1, 22, false))));
                                            J$.addAxiom(J$.B(330, '===', J$.R(1329, 'this', this, false, false), J$.B(322, '+', J$.B(314, '+', J$.B(306, '+', J$.R(1337, 'S1', S1, false, false), J$.R(1345, 'str', str, false, false)), J$.R(1353, 'S2', S2, false, false)), J$.R(1361, 'T', T, false, false))));
                                            J$.addAxiom(J$.B(338, '===', J$.R(1369, 'ret', ret, false, false), J$.G(1385, J$.R(1377, 'S1', S1, false, false), 'length')));
                                            J$.addAxiom(J$.U(346, '!', J$.M(1409, J$.R(1393, 'reg', reg, false, false), 'test', false)(J$.R(1401, 'S2', S2, false, false))));
                                            J$.addAxiom(J$.T(1417, 'and', 21, false));
                                            J$.addAxiom(J$.T(1425, 'begin', 21, false));
                                            J$.addAxiom(J$.B(362, '===', J$.R(1433, 'ret', ret, false, false), J$.U(354, '-', J$.T(1441, 1, 22, false))));
                                            J$.addAxiom(J$.U(370, '!', J$.M(1465, J$.R(1449, 'reg', reg, false, false), 'test', false)(J$.R(1457, 'this', this, false, false))));
                                            J$.addAxiom(J$.T(1473, 'and', 21, false));
                                            J$.addAxiom(J$.T(1481, 'or', 21, false));
                                            return J$.Rt(1497, J$.R(1489, 'ret', ret, false, false));
                                        } catch (J$e) {
                                            J$.Ex(4473, J$e);
                                        } finally {
                                            if (J$.Fr(4481))
                                                continue jalangiLabel2;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }, 12, false));
                            J$.P(1785, J$.R(1609, 'sandbox', sandbox, false, false), 'string_charCodeAt', J$.T(1777, function (result, idx) {
                                jalangiLabel3:
                                    while (true) {
                                        try {
                                            J$.Fe(1737, arguments.callee, this, arguments);
                                            arguments = J$.N(1745, 'arguments', arguments, true, false);
                                            result = J$.N(1753, 'result', result, true, false);
                                            idx = J$.N(1761, 'idx', idx, true, false);
                                            J$.N(1769, 'ret', ret, false, false);
                                            var ret = J$.W(1633, 'ret', J$.readInput(J$.R(1617, 'result', result, false, false), J$.T(1625, true, 23, false)), ret, false, false);
                                            J$.addAxiom(J$.T(1641, 'begin', 21, false));
                                            J$.addAxiom(J$.B(386, '===', J$.M(1681, J$.R(1649, 'this', this, false, false), 'substring', false)(J$.R(1657, 'idx', idx, false, false), J$.B(378, '+', J$.R(1665, 'idx', idx, false, false), J$.T(1673, 1, 22, false))), J$.M(1705, J$.I(typeof String === 'undefined' ? String = J$.R(1689, 'String', undefined, true, true) : String = J$.R(1689, 'String', String, true, true)), 'fromCharCode', false)(J$.R(1697, 'ret', ret, false, false))));
                                            J$.addAxiom(J$.T(1713, 'and', 21, false));
                                            return J$.Rt(1729, J$.R(1721, 'ret', ret, false, false));
                                        } catch (J$e) {
                                            J$.Ex(4489, J$e);
                                        } finally {
                                            if (J$.Fr(4497))
                                                continue jalangiLabel3;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }, 12, false));
                            J$.P(2665, J$.R(1793, 'sandbox', sandbox, false, false), 'string_substring', J$.T(2657, function (result, start, end) {
                                jalangiLabel4:
                                    while (true) {
                                        try {
                                            J$.Fe(2577, arguments.callee, this, arguments);
                                            arguments = J$.N(2585, 'arguments', arguments, true, false);
                                            result = J$.N(2593, 'result', result, true, false);
                                            start = J$.N(2601, 'start', start, true, false);
                                            end = J$.N(2609, 'end', end, true, false);
                                            J$.N(2617, 'ret', ret, false, false);
                                            J$.N(2625, 'S1', S1, false, false);
                                            J$.N(2633, 'S2', S2, false, false);
                                            J$.N(2641, 's', s, false, false);
                                            J$.N(2649, 'e', e, false, false);
                                            if (J$.C(16, J$.B(394, '===', J$.R(1801, 'end', end, false, false), J$.T(1809, undefined, 24, false)))) {
                                                J$.Ce(4505, 16);
                                                end = J$.W(1833, 'end', J$.G(1825, J$.R(1817, 'this', this, false, false), 'length'), end, false, false);
                                                J$.Cr(4513, 16);
                                            }
                                            var ret = J$.W(1857, 'ret', J$.readInput(J$.R(1841, 'result', result, false, false), J$.T(1849, true, 23, false)), ret, false, false);
                                            J$.addAxiom(J$.T(1865, 'begin', 21, false));
                                            var S1 = J$.W(1889, 'S1', J$.readInput(J$.T(1873, '', 21, false), J$.T(1881, true, 23, false)), S1, false, false);
                                            var S2 = J$.W(1913, 'S2', J$.readInput(J$.T(1897, '', 21, false), J$.T(1905, true, 23, false)), S2, false, false);
                                            var s = J$.W(1937, 's', J$.readInput(J$.T(1921, 0, 22, false), J$.T(1929, true, 23, false)), s, false, false);
                                            var e = J$.W(1961, 'e', J$.readInput(J$.T(1945, 0, 22, false), J$.T(1953, true, 23, false)), e, false, false);
                                            J$.addAxiom(J$.T(1969, 'begin', 21, false));
                                            J$.addAxiom(J$.T(1977, 'begin', 21, false));
                                            J$.addAxiom(J$.B(402, '>=', J$.R(1985, 'start', start, false, false), J$.T(1993, 0, 22, false)));
                                            J$.addAxiom(J$.B(410, '<', J$.R(2001, 'start', start, false, false), J$.G(2017, J$.R(2009, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(418, '===', J$.R(2025, 's', s, false, false), J$.R(2033, 'start', start, false, false)));
                                            J$.addAxiom(J$.T(2041, 'and', 21, false));
                                            J$.addAxiom(J$.T(2049, 'begin', 21, false));
                                            J$.addAxiom(J$.B(426, '<', J$.R(2057, 'start', start, false, false), J$.T(2065, 0, 22, false)));
                                            J$.addAxiom(J$.B(434, '===', J$.R(2073, 's', s, false, false), J$.T(2081, 0, 22, false)));
                                            J$.addAxiom(J$.T(2089, 'and', 21, false));
                                            J$.addAxiom(J$.T(2097, 'begin', 21, false));
                                            J$.addAxiom(J$.B(442, '>=', J$.R(2105, 'start', start, false, false), J$.G(2121, J$.R(2113, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(450, '===', J$.R(2129, 's', s, false, false), J$.G(2145, J$.R(2137, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.T(2153, 'and', 21, false));
                                            J$.addAxiom(J$.T(2161, 'or', 21, false));
                                            J$.addAxiom(J$.T(2169, 'begin', 21, false));
                                            J$.addAxiom(J$.T(2177, 'begin', 21, false));
                                            J$.addAxiom(J$.B(458, '>=', J$.R(2185, 'end', end, false, false), J$.T(2193, 0, 22, false)));
                                            J$.addAxiom(J$.B(466, '<', J$.R(2201, 'end', end, false, false), J$.G(2217, J$.R(2209, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(474, '===', J$.R(2225, 'e', e, false, false), J$.R(2233, 'end', end, false, false)));
                                            J$.addAxiom(J$.T(2241, 'and', 21, false));
                                            J$.addAxiom(J$.T(2249, 'begin', 21, false));
                                            J$.addAxiom(J$.B(482, '<', J$.R(2257, 'end', end, false, false), J$.T(2265, 0, 22, false)));
                                            J$.addAxiom(J$.B(490, '===', J$.R(2273, 'e', e, false, false), J$.T(2281, 0, 22, false)));
                                            J$.addAxiom(J$.T(2289, 'and', 21, false));
                                            J$.addAxiom(J$.T(2297, 'begin', 21, false));
                                            J$.addAxiom(J$.B(498, '>=', J$.R(2305, 'end', end, false, false), J$.G(2321, J$.R(2313, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(506, '===', J$.R(2329, 'e', e, false, false), J$.G(2345, J$.R(2337, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.T(2353, 'and', 21, false));
                                            J$.addAxiom(J$.T(2361, 'or', 21, false));
                                            J$.addAxiom(J$.T(2369, 'begin', 21, false));
                                            J$.addAxiom(J$.T(2377, 'begin', 21, false));
                                            J$.addAxiom(J$.B(514, '<=', J$.R(2385, 's', s, false, false), J$.R(2393, 'e', e, false, false)));
                                            J$.addAxiom(J$.B(538, '===', J$.R(2401, 'this', this, false, false), J$.B(530, '+', J$.B(522, '+', J$.R(2409, 'S1', S1, false, false), J$.R(2417, 'ret', ret, false, false)), J$.R(2425, 'S2', S2, false, false))));
                                            J$.addAxiom(J$.B(546, '===', J$.R(2433, 's', s, false, false), J$.G(2449, J$.R(2441, 'S1', S1, false, false), 'length')));
                                            J$.addAxiom(J$.B(562, '===', J$.B(554, '-', J$.R(2457, 'e', e, false, false), J$.R(2465, 's', s, false, false)), J$.G(2481, J$.R(2473, 'ret', ret, false, false), 'length')));
                                            J$.addAxiom(J$.T(2489, 'and', 21, false));
                                            J$.addAxiom(J$.T(2497, 'begin', 21, false));
                                            J$.addAxiom(J$.B(570, '>', J$.R(2505, 's', s, false, false), J$.R(2513, 'e', e, false, false)));
                                            J$.addAxiom(J$.B(578, '===', J$.R(2521, 'ret', ret, false, false), J$.T(2529, '', 21, false)));
                                            J$.addAxiom(J$.T(2537, 'and', 21, false));
                                            J$.addAxiom(J$.T(2545, 'or', 21, false));
                                            J$.addAxiom(J$.T(2553, 'and', 21, false));
                                            return J$.Rt(2569, J$.R(2561, 'ret', ret, false, false));
                                        } catch (J$e) {
                                            J$.Ex(4521, J$e);
                                        } finally {
                                            if (J$.Fr(4529))
                                                continue jalangiLabel4;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }, 12, false));
                            J$.P(3537, J$.R(2673, 'sandbox', sandbox, false, false), 'string_substr', J$.T(3529, function (result, start, length) {
                                jalangiLabel5:
                                    while (true) {
                                        try {
                                            J$.Fe(3449, arguments.callee, this, arguments);
                                            arguments = J$.N(3457, 'arguments', arguments, true, false);
                                            result = J$.N(3465, 'result', result, true, false);
                                            start = J$.N(3473, 'start', start, true, false);
                                            length = J$.N(3481, 'length', length, true, false);
                                            J$.N(3489, 'ret', ret, false, false);
                                            J$.N(3497, 'S1', S1, false, false);
                                            J$.N(3505, 'S2', S2, false, false);
                                            J$.N(3513, 's', s, false, false);
                                            J$.N(3521, 'l', l, false, false);
                                            var ret = J$.W(2697, 'ret', J$.readInput(J$.R(2681, 'result', result, false, false), J$.T(2689, true, 23, false)), ret, false, false);
                                            J$.addAxiom(J$.T(2705, 'begin', 21, false));
                                            var S1 = J$.W(2729, 'S1', J$.readInput(J$.T(2713, '', 21, false), J$.T(2721, true, 23, false)), S1, false, false);
                                            var S2 = J$.W(2753, 'S2', J$.readInput(J$.T(2737, '', 21, false), J$.T(2745, true, 23, false)), S2, false, false);
                                            var s = J$.W(2777, 's', J$.readInput(J$.T(2761, 0, 22, false), J$.T(2769, true, 23, false)), s, false, false);
                                            var l = J$.W(2801, 'l', J$.readInput(J$.T(2785, 0, 22, false), J$.T(2793, true, 23, false)), l, false, false);
                                            J$.addAxiom(J$.T(2809, 'begin', 21, false));
                                            J$.addAxiom(J$.T(2817, 'begin', 21, false));
                                            J$.addAxiom(J$.B(586, '>=', J$.R(2825, 'start', start, false, false), J$.T(2833, 0, 22, false)));
                                            J$.addAxiom(J$.B(594, '<', J$.R(2841, 'start', start, false, false), J$.G(2857, J$.R(2849, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(602, '===', J$.R(2865, 's', s, false, false), J$.R(2873, 'start', start, false, false)));
                                            J$.addAxiom(J$.T(2881, 'and', 21, false));
                                            J$.addAxiom(J$.T(2889, 'begin', 21, false));
                                            J$.addAxiom(J$.B(610, '>=', J$.R(2897, 'start', start, false, false), J$.G(2913, J$.R(2905, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(618, '===', J$.R(2921, 's', s, false, false), J$.G(2937, J$.R(2929, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.T(2945, 'and', 21, false));
                                            J$.addAxiom(J$.T(2953, 'begin', 21, false));
                                            J$.addAxiom(J$.B(626, '<', J$.R(2961, 'start', start, false, false), J$.T(2969, 0, 22, false)));
                                            J$.addAxiom(J$.B(642, '>=', J$.R(2977, 'start', start, false, false), J$.U(634, '-', J$.G(2993, J$.R(2985, 'this', this, false, false), 'length'))));
                                            J$.addAxiom(J$.B(658, '===', J$.R(3001, 's', s, false, false), J$.B(650, '+', J$.G(3017, J$.R(3009, 'this', this, false, false), 'length'), J$.R(3025, 'start', start, false, false))));
                                            J$.addAxiom(J$.T(3033, 'and', 21, false));
                                            J$.addAxiom(J$.T(3041, 'begin', 21, false));
                                            J$.addAxiom(J$.B(674, '<', J$.R(3049, 'start', start, false, false), J$.U(666, '-', J$.G(3065, J$.R(3057, 'this', this, false, false), 'length'))));
                                            J$.addAxiom(J$.B(682, '===', J$.R(3073, 's', s, false, false), J$.T(3081, 0, 22, false)));
                                            J$.addAxiom(J$.T(3089, 'and', 21, false));
                                            J$.addAxiom(J$.T(3097, 'or', 21, false));
                                            J$.addAxiom(J$.T(3105, 'begin', 21, false));
                                            J$.addAxiom(J$.T(3113, 'begin', 21, false));
                                            J$.addAxiom(J$.B(690, '>=', J$.R(3121, 'length', length, false, false), J$.T(3129, 0, 22, false)));
                                            J$.addAxiom(J$.B(706, '<=', J$.R(3137, 'length', length, false, false), J$.B(698, '-', J$.G(3153, J$.R(3145, 'this', this, false, false), 'length'), J$.R(3161, 's', s, false, false))));
                                            J$.addAxiom(J$.B(714, '===', J$.R(3169, 'l', l, false, false), J$.R(3177, 'length', length, false, false)));
                                            J$.addAxiom(J$.T(3185, 'and', 21, false));
                                            J$.addAxiom(J$.T(3193, 'begin', 21, false));
                                            J$.addAxiom(J$.B(722, '<', J$.R(3201, 'length', length, false, false), J$.T(3209, 0, 22, false)));
                                            J$.addAxiom(J$.B(730, '===', J$.R(3217, 'l', l, false, false), J$.T(3225, 0, 22, false)));
                                            J$.addAxiom(J$.T(3233, 'and', 21, false));
                                            J$.addAxiom(J$.T(3241, 'begin', 21, false));
                                            J$.addAxiom(J$.B(746, '>', J$.R(3249, 'length', length, false, false), J$.B(738, '-', J$.G(3265, J$.R(3257, 'this', this, false, false), 'length'), J$.R(3273, 's', s, false, false))));
                                            J$.addAxiom(J$.B(762, '===', J$.R(3281, 'l', l, false, false), J$.B(754, '-', J$.G(3297, J$.R(3289, 'this', this, false, false), 'length'), J$.R(3305, 's', s, false, false))));
                                            J$.addAxiom(J$.T(3313, 'and', 21, false));
                                            J$.addAxiom(J$.T(3321, 'or', 21, false));
                                            J$.addAxiom(J$.T(3329, 'begin', 21, false));
                                            J$.addAxiom(J$.B(786, '===', J$.R(3337, 'this', this, false, false), J$.B(778, '+', J$.B(770, '+', J$.R(3345, 'S1', S1, false, false), J$.R(3353, 'ret', ret, false, false)), J$.R(3361, 'S2', S2, false, false))));
                                            J$.addAxiom(J$.B(794, '===', J$.R(3369, 's', s, false, false), J$.G(3385, J$.R(3377, 'S1', S1, false, false), 'length')));
                                            J$.addAxiom(J$.B(802, '===', J$.R(3393, 'l', l, false, false), J$.G(3409, J$.R(3401, 'ret', ret, false, false), 'length')));
                                            J$.addAxiom(J$.T(3417, 'and', 21, false));
                                            J$.addAxiom(J$.T(3425, 'and', 21, false));
                                            return J$.Rt(3441, J$.R(3433, 'ret', ret, false, false));
                                        } catch (J$e) {
                                            J$.Ex(4537, J$e);
                                        } finally {
                                            if (J$.Fr(4545))
                                                continue jalangiLabel5;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }, 12, false));
                            J$.P(3961, J$.R(3545, 'sandbox', sandbox, false, false), 'string_charAt', J$.T(3953, function (result, start) {
                                jalangiLabel6:
                                    while (true) {
                                        try {
                                            J$.Fe(3897, arguments.callee, this, arguments);
                                            arguments = J$.N(3905, 'arguments', arguments, true, false);
                                            result = J$.N(3913, 'result', result, true, false);
                                            start = J$.N(3921, 'start', start, true, false);
                                            J$.N(3929, 'ret', ret, false, false);
                                            J$.N(3937, 'S1', S1, false, false);
                                            J$.N(3945, 'S2', S2, false, false);
                                            var ret = J$.W(3569, 'ret', J$.readInput(J$.R(3553, 'result', result, false, false), J$.T(3561, true, 23, false)), ret, false, false);
                                            J$.addAxiom(J$.T(3577, 'begin', 21, false));
                                            J$.addAxiom(J$.T(3585, 'begin', 21, false));
                                            var S1 = J$.W(3609, 'S1', J$.readInput(J$.T(3593, '', 21, false), J$.T(3601, true, 23, false)), S1, false, false);
                                            var S2 = J$.W(3633, 'S2', J$.readInput(J$.T(3617, '', 21, false), J$.T(3625, true, 23, false)), S2, false, false);
                                            J$.addAxiom(J$.B(810, '>=', J$.R(3641, 'start', start, false, false), J$.T(3649, 0, 22, false)));
                                            J$.addAxiom(J$.B(818, '<', J$.R(3657, 'start', start, false, false), J$.G(3673, J$.R(3665, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(842, '===', J$.R(3681, 'this', this, false, false), J$.B(834, '+', J$.B(826, '+', J$.R(3689, 'S1', S1, false, false), J$.R(3697, 'ret', ret, false, false)), J$.R(3705, 'S2', S2, false, false))));
                                            J$.addAxiom(J$.B(850, '===', J$.R(3713, 'start', start, false, false), J$.G(3729, J$.R(3721, 'S1', S1, false, false), 'length')));
                                            J$.addAxiom(J$.B(858, '===', J$.G(3745, J$.R(3737, 'ret', ret, false, false), 'length'), J$.T(3753, 1, 22, false)));
                                            J$.addAxiom(J$.T(3761, 'and', 21, false));
                                            J$.addAxiom(J$.T(3769, 'begin', 21, false));
                                            J$.addAxiom(J$.B(866, '<', J$.R(3777, 'start', start, false, false), J$.T(3785, 0, 22, false)));
                                            J$.addAxiom(J$.B(874, '===', J$.R(3793, 'ret', ret, false, false), J$.T(3801, '', 21, false)));
                                            J$.addAxiom(J$.T(3809, 'and', 21, false));
                                            J$.addAxiom(J$.T(3817, 'begin', 21, false));
                                            J$.addAxiom(J$.B(882, '>=', J$.R(3825, 'start', start, false, false), J$.G(3841, J$.R(3833, 'this', this, false, false), 'length')));
                                            J$.addAxiom(J$.B(890, '===', J$.R(3849, 'ret', ret, false, false), J$.T(3857, '', 21, false)));
                                            J$.addAxiom(J$.T(3865, 'and', 21, false));
                                            J$.addAxiom(J$.T(3873, 'or', 21, false));
                                            return J$.Rt(3889, J$.R(3881, 'ret', ret, false, false));
                                        } catch (J$e) {
                                            J$.Ex(4553, J$e);
                                        } finally {
                                            if (J$.Fr(4561))
                                                continue jalangiLabel6;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }, 12, false));
                            J$.P(4105, J$.R(3969, 'sandbox', sandbox, false, false), 'builtin_parseInt', J$.T(4097, function (result, s) {
                                jalangiLabel7:
                                    while (true) {
                                        try {
                                            J$.Fe(4057, arguments.callee, this, arguments);
                                            arguments = J$.N(4065, 'arguments', arguments, true, false);
                                            result = J$.N(4073, 'result', result, true, false);
                                            s = J$.N(4081, 's', s, true, false);
                                            J$.N(4089, 'ret', ret, false, false);
                                            var ret = J$.W(3993, 'ret', J$.readInput(J$.R(3977, 'result', result, false, false), J$.T(3985, true, 23, false)), ret, false, false);
                                            J$.addAxiom(J$.T(4001, 'begin', 21, false));
                                            J$.addAxiom(J$.B(906, '===', J$.R(4009, 'ret', ret, false, false), J$.B(898, '*', J$.R(4017, 's', s, false, false), J$.T(4025, 1, 22, false))));
                                            J$.addAxiom(J$.T(4033, 'and', 21, false));
                                            return J$.Rt(4049, J$.R(4041, 'ret', ret, false, false));
                                        } catch (J$e) {
                                            J$.Ex(4569, J$e);
                                        } finally {
                                            if (J$.Fr(4577))
                                                continue jalangiLabel7;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }, 12, false));
                            J$.P(4337, J$.R(4113, 'sandbox', sandbox, false, false), 'object_getField', J$.T(4329, function (result, base, offset) {
                                jalangiLabel8:
                                    while (true) {
                                        try {
                                            J$.Fe(4273, arguments.callee, this, arguments);
                                            arguments = J$.N(4281, 'arguments', arguments, true, false);
                                            result = J$.N(4289, 'result', result, true, false);
                                            base = J$.N(4297, 'base', base, true, false);
                                            offset = J$.N(4305, 'offset', offset, true, false);
                                            J$.N(4313, 'ret', ret, false, false);
                                            J$.N(4321, 'i', i, false, false);
                                            var ret = J$.W(4137, 'ret', J$.readInput(J$.T(4121, 0, 22, false), J$.T(4129, true, 23, false)), ret, false, false);
                                            J$.addAxiom(J$.T(4145, 'begin', 21, false));
                                            for (var i in J$.H(4233, J$.R(4153, 'base', base, false, false))) {
                                                J$.N(4241, 'i', i, false, true);
                                                {
                                                    {
                                                        J$.addAxiom(J$.T(4161, 'begin', 21, false));
                                                        J$.addAxiom(J$.B(922, '===', J$.R(4169, 'i', i, false, false), J$.B(914, '+', J$.R(4177, 'offset', offset, false, false), J$.T(4185, '', 21, false))));
                                                        J$.addAxiom(J$.B(930, '===', J$.R(4193, 'ret', ret, false, false), J$.G(4217, J$.R(4201, 'base', base, false, false), J$.R(4209, 'i', i, false, false))));
                                                        J$.addAxiom(J$.T(4225, 'and', 21, false));
                                                    }
                                                }
                                            }
                                            J$.addAxiom(J$.T(4249, 'or', 21, false));
                                            return J$.Rt(4265, J$.R(4257, 'ret', ret, false, false));
                                        } catch (J$e) {
                                            J$.Ex(4585, J$e);
                                        } finally {
                                            if (J$.Fr(4593))
                                                continue jalangiLabel8;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }, 12, false));
                        } catch (J$e) {
                            J$.Ex(4601, J$e);
                        } finally {
                            if (J$.Fr(4609))
                                continue jalangiLabel9;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false), false)(J$.G(4401, J$.I(typeof module === 'undefined' ? module = J$.R(4393, 'module', undefined, true, true) : module = J$.R(4393, 'module', module, true, true)), 'exports'));
        } catch (J$e) {
            J$.Ex(4617, J$e);
        } finally {
            if (J$.Sr(4625))
                continue jalangiLabel10;
            else
                break jalangiLabel10;
        }
    }
// JALANGI DO NOT INSTRUMENT

