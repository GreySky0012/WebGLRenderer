/**
 * Created by 53017_000 on 2016/12/9.
 */

var Material = {
    create:function () {
        var material = {};

        material.m_gls = 20.0;
        material.m_Ka = new Vector3([1.0,1.0,1.0]);
        material.m_Kd = new Vector3([1.0,1.0,1.0]);
        material.m_Ks = new Vector3([1.0,1.0,1.0]);

        material.d = 1.0;

        material.clone = function (m) {
            this.m_Ka = m.m_Ka;
            this.m_gls = m.m_gls;
            this.m_Kd = m.m_Kd;
            this.m_Ks = m.m_Ks;
            this.d = m.d;

            return this;
        }

        return material;
    }
}